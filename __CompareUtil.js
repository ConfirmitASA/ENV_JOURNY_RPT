class CompareUtil {

    static var numberOfParameters = 5;
    static var parameterNamePrefix = 'p_ScriptedCompareParameter';
    static var distributionParameterName = 'p_Distribution';
    static var configTriggerParameterName = 'EnableCompareSection';
    static var configDistributionTriggerParameterName = 'EnableCompareDistribution';
    static var configCompareQuestionsParameterName = 'CompareQuestions';
    static var parameterTypeQuestion = 'Question';
    static var parameterTypeDistribution = 'Distribution';

    /**
     * Get the list of compare question ids
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Array} - array of questions to filter survey data by (not page specific)
     */
    static function GetCompareQuestionIds (context) {

        var log = context.log;
        return DataSourceUtil.getSurveyPropertyValueFromConfig(context, CompareUtil.configCompareQuestionsParameterName);
    }

    /**
     * Hide compare parameter placeholder if there're no options
     * @param {object} context object {state: state, report: report, pageContext: pageContext, log: log}
     * @param {string} parameterType type ('Question' or 'Distribution') of scripted filter
     * @param {string} parameterNumber number of scripted filter
     * @returns {boolean} indicates if filter exists
     */
    static function hideScriptedCompareParameterByOrder(context, parameterType, parameterNumber) {

        var log = context.log;
        var pageId = PageUtil.getCurrentPageIdInConfig(context);

        try {
            var parameterName = parameterType === CompareUtil.parameterTypeQuestion
                ? CompareUtil.parameterNamePrefix + parameterNumber
                : (parameterType == CompareUtil.parameterTypeDistribution
                    ? CompareUtil.distributionParameterName
                    : '');
            var optionsList = ParamUtil.GetParameterOptions(context,  parameterName);
        }
        catch (e) {
            throw new Error('CompareUtil - something wrong with parameter name or options');
        }

        try {
            var parameterEnableName = parameterType === CompareUtil.parameterTypeQuestion
                ? CompareUtil.configTriggerParameterName
                : (parameterType == CompareUtil.parameterTypeDistribution
                    ? CompareUtil.configDistributionTriggerParameterName
                    : ''); // '' is not checked there, because if there's an error with parameterType it will be checked before in previous catch
            var isThisTypeOfParameterEnabled = DataSourceUtil.getPropertyValueFromConfig(context, pageId, parameterEnableName);
        }
        catch (e) {
            return true; // if there's no such property for current page in Config
        }

        return isThisTypeOfParameterEnabled && optionsList.length <= 0;
    }

    /**
     * Get scripted compare parameter title
     * @param {object} context object {state: state, report: report, log: log}
     * @param {string} parameterNumber number of scripted Compare parameter by type
     * @returns {string} question title
     */
    static function getScriptedCompareParameterNameByOrder(context, parameterNumber) {

        var log = context.log;
        var parametersList = CompareUtil.GetCompareQuestionIds(context);

        if(parametersList.length >= parameterNumber) {
            return QuestionUtil.getQuestionTitle(context, parametersList[parameterNumber-1]);
        }

        return '';
    }

    /**
     * Set mask (NA) for Compare parameter.
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext, mask: mask}
     */
    static function setMaskForCompareParameter(context) {
        var mask = context.mask;
        var pageId = PageUtil.getCurrentPageIdInConfig(context);
        var naCode = DataSourceUtil.getPropertyValueFromConfig(context, pageId, 'NA_answerCode');

        mask.Access = ParameterAccessType.Exclusive;
        mask.Keys.Add(naCode);
    }

    /**
     * Get Compare question id by index and type from Config
     * @param {object} context object {state: state, report: report, log: log}
     * @param {string} parameterIndex index of parameter in question ids array in Config
     * @returns {string} question id
     */
    static function getCompareQuestionIdFromConfig(context, parameterIndex) {
        var arrayParameterIndex = parseInt(parameterIndex - 1);
        var questionIds = DataSourceUtil.getSurveyPropertyValueFromConfig(context, CompareUtil.configCompareQuestionsParameterName);
        return arrayParameterIndex < questionIds.length && arrayParameterIndex >= 0 ? questionIds[arrayParameterIndex] : null;
    }

    /**
     * Add Compare subheaders to parent header
     * @param {object} context object {state: state, report: report, log: log}
     * @param {Header} parentHeader
     * @returns {boolean} indicates if headers for at least one of the parameters have been added
     */
    static function addCompareNestedHeaders(context, parentHeader) {
        var headersAdded = false;

        for (var i = 1; i <= CompareUtil.numberOfParameters; i++) {
            var tempParameterName = CompareUtil.parameterNamePrefix + i;
            if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                TableUtil.addBreakByNestedHeader(context, parentHeader, {Id: tempParameterName, Type: 'Answer'});
                headersAdded = true;
            }
        }

        return headersAdded;
    }

    /**
     * Returns true if Compare mode is on
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {boolean} indicates if Compare mode is on
     **/
    static function isInCompareMode(context) {
        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        var isInCompareMode;
        try {
            for (var i = 1; i <= CompareUtil.numberOfParameters; i++) {
                var tempParameterName = CompareUtil.parameterNamePrefix + i;
                if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                    isInCompareMode = true;
                    break;
                }
            }

            isInCompareMode = isInCompareMode && DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configTriggerParameterName);
        }
        catch(e) {
            isInCompareMode = false; // if there's no such property for current page in Config
        }

        var isInCompareModeWithDistribution;
        try {
            isInCompareModeWithDistribution = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configTriggerParameterName)
                && ParamUtil.GetSelectedCodes(context, CompareUtil.distributionParameterName).length > 0;
        }
        catch(e) {
            isInCompareModeWithDistribution = false; // if there's no such property for current page in Config
        }

        return isInCompareMode || isInCompareModeWithDistribution;
    }

    /**
     * Get selected options for Compare parameters
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Array} options
     **/
    static function getSelectedCompareOptions(context) {
        var options = [];

        for (var i = 1; i <= CompareUtil.numberOfParameters; i++) {
            var tempParameterName = CompareUtil.parameterNamePrefix + i;
            options = options.concat(ParamUtil.GetSelectedCodes(context, tempParameterName));
        }

        return options;
    }

    /**
     * Returns true if there's EnableCompareSection or EnableDistribution flag for current page in Config
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {boolean} isCompareSectionNeeded
     **/
    static function isCompareSectionNeeded(context) {
        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        var isCompareNeeded = false;
        try {
            isCompareNeeded = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configTriggerParameterName);
        }
        catch (e) { }

        var isDistributionNeeded = false;
        try {
            isDistributionNeeded = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configDistributionTriggerParameterName);
        }
        catch (e) { }

        return isCompareNeeded || isDistributionNeeded;
    }

    /**
     * Returns array of selected values (label and selected options) for Compare parameters (including Distribution)
     * @param {Object} context
     * @returns {Array} Array of objects {Label: label, selectedOptions: [{Label: label, Code: code}]}
     **/
    static function GetCompareParametersValues (context) {

        var log = context.log;

        var parameterValues = [];
        var parameters = CompareUtil.GetCompareQuestionIds(context);
        var parameterNamePrefix = CompareUtil.parameterNamePrefix;

        for (var i=0; i<parameters.length; i++) {
            // support for multi select. If you need multi-selectors, no code changes are needed, change only parameter setting + ? list css class
            var selectedOptions = ParamUtil.GetSelectedOptions(context, parameterNamePrefix+(i+1));
            var parameterName = CompareUtil.getScriptedCompareParameterNameByOrder(context, i+1);

            if(selectedOptions.length>0) {
                parameterValues.push({Label: parameterName, selectedOptions: selectedOptions});
            }
        }

        var selectedDistributionOptions = ParamUtil.GetSelectedOptions(context, CompareUtil.distributionParameterName);
        if(selectedDistributionOptions.length>0) {
            parameterValues.push({Label: CompareUtil.distributionParameterName, selectedOptions: selectedDistributionOptions});
        }

        return parameterValues;
    }
}
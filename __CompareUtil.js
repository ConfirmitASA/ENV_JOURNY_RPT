class CompareUtil {

    static var numberOfBreakByParameters = 5;
    static var breakByParameterNamePrefix = 'p_ScriptedBBCompareParameter';

    static var numberOfFilterParameters = 5;
    static var filterParameterNamePrefix = 'p_ScriptedFCompareParameter';

    /**
     * Get the list of compare question ids by type
     * @param {object} context object {state: state, report: report, log: log}
     * @param {string} parameterType type of scripted filter (only 'BreakBy' or 'Filter')
     * @returns {Array} - array of questions to filter survey data by (not page specific)
     */
    static function GetCompareQuestionIdsByType (context, parameterType) {

        var log = context.log;
        return DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'Compare' + parameterType + 'Questions');
    }

    /**
     * Get info (name prefix and number of parameters) for Compare parameter by type
     * @param {object} context object {state: state, report: report, pageContext: pageContext, log: log}
     * @param {string} parameterType type of scripted filter (only 'BreakBy' or 'Filter')
     * @param {string} parameterNumber number of scripted filter
     * @returns {boolean} indicates if filter exists
     */
    static function GetCompareParameterInfo(parameterType) {
        if (parameterType === 'BreakBy') {
            return {
                numberOfParameters: CompareUtil.numberOfBreakByParameters,
                parameterNamePrefix: CompareUtil.breakByParameterNamePrefix
            };
        } else if (parameterType === 'Filter') {
            return {
                numberOfParameters: CompareUtil.numberOfFilterParameters,
                parameterNamePrefix: CompareUtil.filterParameterNamePrefix
            };
        }
    }

    /**
     * Hide compare parameter placeholder if there're no options.
     * @param {object} context object {state: state, report: report, pageContext: pageContext, log: log}
     * @param {string} parameterType type of scripted filter (only 'BreakBy' or 'Filter')
     * @param {string} parameterNumber number of scripted filter
     * @returns {boolean} indicates if filter exists
     */
    static function hideScriptedCompareParameterByOrder(context, parameterType, parameterNumber) {

        var log = context.log;
        var parameterNamePrefix = GetCompareParameterInfo(parameterType).parameterNamePrefix;
        var optionsList = ParamUtil.GetParameterOptions(context, parameterNamePrefix + parameterNumber);

        var pageId = PageUtil.getCurrentPageIdInConfig(context);
        try {
            var isThisTypeOfParameterEnabled = DataSourceUtil.getPropertyValueFromConfig(context, pageId, 'EnableCompare' + parameterType + 'Section');
        }
        catch (e) {
            return true; // if there's no such property for current page in Config
        }

        return isThisTypeOfParameterEnabled && optionsList.length <= 0;
    }

    /**
     * Get scripted compare parameter title.
     * @param {object} context object {state: state, report: report, log: log}
     * @param {string} parameterType type of scripted filter (only 'BreakBy' or 'Filter')
     * @param {string} parameterNumber number of scripted Compare parameter by type
     * @returns {string} question title
     */
    static function getScriptedCompareParameterNameByOrder(context, parameterType, parameterNumber) {

        var log = context.log;
        var parametersList = GetCompareQuestionIdsByType(context, parameterType);

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
     * @param {string} parameterType is used to identify parameter type ('BreakBy' or 'Filter') and choose correct question ids array in Config
     * @param {string} parameterIndex index of parameter in question ids array in Config
     * @returns {string} question id
     */
    static function getCompareQuestionIdFromConfig(context, parameterType, parameterIndex) {
        var arrayParameterIndex = parseInt(parameterIndex - 1);
        var questionIds = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'Compare' + parameterType + 'Questions');
        return arrayParameterIndex < questionIds.length && arrayParameterIndex >= 0 ? questionIds[arrayParameterIndex] : null;
    }

    /**
     * Add Compare break by subheaders to parent header
     * @param {object} context object {state: state, report: report, log: log}
     * @param {Header} parentHeader
     * @returns {boolean} indicates if headers for at least one of the parameters have been added
     */
    static function addCompareBreakByNestedHeaders(context, parentHeader) {
        var headersAdded = false;

        for (var i = 1; i <= CompareUtil.numberOfBreakByParameters; i++) {
            var tempParameterName = CompareUtil.breakByParameterNamePrefix + i;
            if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                TableUtil.addBreakByNestedHeader(context, parentHeader, {Id: tempParameterName, Type: 'Answer'});
                headersAdded = true;
            }
        }

        return headersAdded;
    }

    /**
     * Returns true if Compare mode is on (at least one of the Compare parameters of that type)
     * @param {object} context object {state: state, report: report, log: log}
     * @param {string} parameterType type of scripted filter (only 'BreakBy' or 'Filter')
     * @returns {boolean} indicates if Compare mode is on
     **/
    static function isInCompareModeByType(context, parameterType) {
        var isInCompareMode = false;
        var parameterInfo = GetCompareParameterInfo(parameterType);

        for (var i = 1; i <= parameterInfo.numberOfParameters; i++) {
            var tempParameterName = parameterInfo.parameterNamePrefix + i;
            if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                isInCompareMode = true;
                break;
            }
        }

        return isInCompareMode;
    }

    /**
     * Returns true if Compare mode is on (for all types of Compare parameters)
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {boolean} indicates if Compare mode is on
     **/
    static function isInCompareMode(context) {
        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        var isInCompareBreakByMode;
        try {
            isInCompareBreakByMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'EnableCompareBreakBySection')
                && CompareUtil.isInCompareModeByType(context, 'BreakBy');
        }
        catch(e) {
            isInCompareBreakByMode = false; // if there's no such property for current page in Config
        }

        var isInCompareFilterMode;
        try {
            isInCompareFilterMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'EnableCompareFilterSection')
                && CompareUtil.isInCompareModeByType(context, 'Filter');
        }
        catch(e) {
            isInCompareFilterMode = false; // if there's no such property for current page in Config
        }

        return isInCompareBreakByMode || isInCompareFilterMode;
    }

    /**
     * Get selected options for all Compare break by parameters
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Array} options
     **/
    static function getSelectedCompareBreakByOptions(context) {
        var options = [];

        for (var i = 1; i <= CompareUtil.numberOfBreakByParameters; i++) {
            var tempParameterName = CompareUtil.breakByParameterNamePrefix + i;
            options = options.concat(ParamUtil.GetSelectedCodes(context, tempParameterName));
        }

        return options;
    }

    /**
     * Returns true if there's EnableCompare*Section (*: 'BreakBy' or 'Filter') flag for  current page in Config
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {boolean} isCompareSectionNeeded
     **/
    static function isCompareSectionNeeded(context) {
        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        var isCompareBreakByNeeded = false;
        try {
            isCompareBreakByNeeded = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'EnableCompareBreakBySection');
        }
        catch (e) { }

        var isCompareFilterNeeded = false;
        try {
            isCompareFilterNeeded = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'EnableCompareFilterSection');
        }
        catch (e) { }

        return isCompareBreakByNeeded || isCompareFilterNeeded;
    }

    /**
     * Function to generate filter expression for the 'FilterPanel' filter. Filter parameters can be both single and multi selects
     * @param {Object} context
     * @param {string} parameterType - type of Compare parameter
     * @returns {Array} Array of objects {Label: label, selectedOptions: [{Label: label, Code: code}]}
     **/

    static function GetCompareParametersValuesByType (context, parameterType) {

        var log = context.log;

        var parameterValues = [];
        var parameters = GetCompareQuestionIdsByType(context, parameterType);
        var parameterNamePrefix = GetCompareParameterInfo(parameterType).parameterNamePrefix;

        for (var i=0; i<parameters.length; i++) {
            // support for multi select. If you need multi-selectors, no code changes are needed, change only parameter setting + ? list css class
            var selectedOptions = ParamUtil.GetSelectedOptions(context, parameterNamePrefix+(i+1));
            var parameterName = getScriptedCompareParameterNameByOrder(context, parameterType, i+1);

            if(selectedOptions.length>0) {
                parameterValues.push({Label: parameterName, selectedOptions: selectedOptions});
            }
        }

        return parameterValues;
    }

    /**
     * Function to generate filter expression for the 'FilterPanel' filter. Filter parameters can be both single and multi selects
     * @param {Object} context
     * @returns {Array} Array of objects {Label: label, selectedOptions: [{Label: label, Code: code}]}
     **/

    static function GetAllCompareParametersValues (context) {

        var log = context.log;

        var breakByParameterValues = GetCompareParametersValuesByType(context, 'BreakBy');
        var filterParameterValues = GetCompareParametersValuesByType(context, 'Filter');

        return breakByParameterValues.concat(filterParameterValues);
    }
}
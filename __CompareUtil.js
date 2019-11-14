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
     * Hide compare parameter placeholder if there're no options.
     * @param {object} context object {state: state, report: report, pageContext: pageContext, log: log}
     * @param {string} parameterType type of scripted filter (only 'BreakBy' or 'Filter')
     * @param {string} parameterNumber number of scripted filter
     * @returns {boolean} indicates if filter exists
     */
    static function hideScriptedCompareParameterByOrder(context, parameterNumber) {

        var log = context.log;
        var parameterType = context.parameterType;
        var parameterNamePrefix = parameterType === 'BreakBy'
            ? CompareUtil.breakByParameterNamePrefix
            : (parameterType === 'Filter'
                ? CompareUtil.filterParameterNamePrefix
                : '');
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
     * @param {string} parameterNumber number of scripted filter
     * @returns {string} question title
     */
    static function getScriptedCompareParameterNameByOrder(context, parameterNumber) {

        var log = context.log;
        var parameterType = context.parameterType;
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
        var numberOfParameters;
        var parameterNamePrefix;

        if (parameterType === 'BreakBy') {
            numberOfParameters = CompareUtil.numberOfBreakByParameters;
            parameterNamePrefix = CompareUtil.breakByParameterNamePrefix;
        } else if (parameterType === 'Filter') {
            numberOfParameters = CompareUtil.numberOfFilterParameters;
            parameterNamePrefix = CompareUtil.filterParameterNamePrefix;
        }

        for (var i = 1; i <= numberOfParameters; i++) {
            var tempParameterName = parameterNamePrefix + i;
            if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                isInCompareMode = true;
                break;
            }
        }

        return isInCompareMode;
    }

    /**
     * Returns true if Compare mode is on (for all types of Compare parameters)
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {boolean} indicates if Compare mode is on
     **/
    static function isInCompareMode(context) {
        return CompareUtil.isInCompareModeByType(context, 'BreakBy') || CompareUtil.isInCompareModeByType(context, 'Filter');
    }

    /**
     * Get number of selected options for all Compare break by parameters
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {int} numberOfOptions
     **/
    static function getNumberOfSelectedCompareBreakByOptions(context) {
        var numberOfOptions = 0;

        for (var i = 1; i <= CompareUtil.numberOfBreakByParameters; i++) {
            var tempParameterName = CompareUtil.breakByParameterNamePrefix + i;
            numberOfOptions += ParamUtil.GetSelectedCodes(context, tempParameterName).length;
        }

        return numberOfOptions;
    }

}
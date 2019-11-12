class CompareUtil {

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
            ? 'p_ScriptedBBCompareParameter'
            : (parameterType === 'Filter'
                ? 'p_ScriptedFCompareParameter'
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
        var questionIds = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'Compare' + parameterType + 'Questions');
        return parameterIndex - 1 < questionIds.length && parameterIndex >= 0 ? questionIds[parameterIndex] : null;
    }

}
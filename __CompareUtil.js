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
        var surveyConfig = DataSourceUtil.getSurveyConfig(context);
        if (surveyConfig['Page_' + pageId]['EnableCompare' + parameterType + 'Section']) {
            var isThisTypeOfParameterEnabled = DataSourceUtil.getPropertyValueFromConfig(context, pageId, 'EnableCompare' + parameterType + 'Section');

            return isThisTypeOfParameterEnabled && optionsList.length <= 0;
        }

        return optionsList.length <= 0;
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

}
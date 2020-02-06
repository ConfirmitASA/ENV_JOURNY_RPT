class CompareUtil {

    static var numberOfQuestionParameters = 5;

    static var questionsParameterNamePrefix = 'p_ScriptedCompareQParameter';
    static var scoreParameterName = 'p_CompareScore';
    static var distributionParameterName = 'p_CompareDistribution';
    static var combinedDistributionParameterName = 'p_CompareCombinedDistribution';

    // survey level
    static var configCompareQuestionsPropertyName = 'CompareQuestions';

    // page level
    static var configQuestionsTriggerPropertyName = 'EnableCompareQuestionsSection';
    static var configCombinedDistributionTriggerPropertyName = 'EnableCompareCombinedDistribution';

    // Compare parameter types
    static var parameterTypeQuestion = 'Question';
    static var parameterTypeCombinedDistribution = 'CombinedDistribution';
    // TODO (if needed): 'Distribution' and 'Score' Compare types

    // Compare mode types
    static var standardCompareModeTypeName = 'StandardMode';
    static var scoreCompareModeTypeName = 'ScoreMode';
    static var distributionCompareModeTypeName = 'DistributionMode';

    static var distributionTextPropertyName = 'Distribution';

    static var scoreCode = '_other';

    /**
     * Get the list of compare question ids
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Array} - array of questions to filter survey data by (not page specific)
     */
    static function GetCompareQuestionIds (context) {

        var log = context.log;
        return DataSourceUtil.getSurveyPropertyValueFromConfig(context, CompareUtil.configCompareQuestionsPropertyName);
    }

    /**
     * Hide compare parameter placeholder if there're no options
     * @param {object} context object {state: state, report: report, pageContext: pageContext, log: log}
     * @param {string} parameterType type ('Question' or 'CombinedDistribution') of scripted filter
     * @param {string} parameterNumber number of scripted filter
     * @returns {boolean} indicates if filter exists
     */
    static function hideScriptedCompareParameterByOrder(context, parameterType, parameterNumber) {

        var log = context.log;
        var pageId = PageUtil.getCurrentPageIdInConfig(context);

        var parameterName;
        switch (parameterType) {
            case CompareUtil.parameterTypeQuestion:
                parameterName = CompareUtil.questionsParameterNamePrefix + parameterNumber;
                break;
            case CompareUtil.parameterTypeCombinedDistribution:
                parameterName = CompareUtil.combinedDistributionParameterName;
                break;
        }

        try {
            var optionsList = ParamUtil.GetParameterOptions(context,  parameterName);
        }
        catch (e) {
            throw new Error('CompareUtil.hideScriptedCompareParameterByOrder: something wrong with parameter name - ' + parameterName + ' - or its options');
        }

        var parameterEnablePropertyName;
        switch (parameterType) {
            case CompareUtil.parameterTypeQuestion:
                parameterEnablePropertyName = CompareUtil.configQuestionsTriggerPropertyName;
                break;
            case CompareUtil.parameterTypeCombinedDistribution:
                parameterEnablePropertyName = CompareUtil.configCombinedDistributionTriggerPropertyName;
                break;
        }

        try {
            var isThisTypeOfParameterEnabled = DataSourceUtil.getPropertyValueFromConfig(context, pageId, parameterEnablePropertyName);
        }
        catch (e) {
            return true; // if there's no such property for current page in Config
        }

        return isThisTypeOfParameterEnabled && optionsList.length <= 0;
    }

    /**
     * Get scripted compare parameter title
     * @param {object} context object {state: state, report: report, log: log}
     * @param {string} parameterType type ('Question' or 'CombinedDistribution') of scripted filter
     * @param {string} parameterNumber number of scripted Compare parameter by type
     * @returns {string} question title
     */
    static function getScriptedCompareParameterNameByOrder(context, parameterType, parameterNumber) {

        var log = context.log;

        switch (parameterType) {
            case CompareUtil.parameterTypeQuestion:
                var parametersList = CompareUtil.GetCompareQuestionIds(context);

                if(parametersList.length >= parameterNumber) {
                    return QuestionUtil.getQuestionTitle(context, parametersList[parameterNumber-1]);
                }
                break;

            case CompareUtil.parameterTypeCombinedDistribution:
                return TextAndParameterUtil.getTextTranslationByKey(context, CompareUtil.distributionTextPropertyName);
        }

        return '';
    }

    /**
     * Set mask (NA) for Compare parameter
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
        var questionIds = DataSourceUtil.getSurveyPropertyValueFromConfig(context, CompareUtil.configCompareQuestionsPropertyName);
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

        for (var i = 1; i <= CompareUtil.numberOfQuestionParameters; i++) {
            var tempParameterName = CompareUtil.questionsParameterNamePrefix + i;
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
            isInCompareMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configQuestionsTriggerPropertyName);
            if (isInCompareMode) {
                isInCompareMode = false;
                for (var i = 1; i <= CompareUtil.numberOfQuestionParameters; i++) {
                    var tempParameterName = CompareUtil.questionsParameterNamePrefix + i;
                    if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                        isInCompareMode = true;
                        break;
                    }
                }
            }
        }
        catch(e) {
            isInCompareMode = false; // if there's no such property for current page in Config
        }

        var isInCompareModeWithCombinedDistribution;
        try {
            isInCompareModeWithCombinedDistribution = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configCombinedDistributionTriggerPropertyName)
                && ParamUtil.GetSelectedCodes(context, CompareUtil.combinedDistributionParameterName).length > 0;
        }
        catch(e) {
            isInCompareModeWithCombinedDistribution = false; // if there's no such property for current page in Config
        }

        return isInCompareMode || isInCompareModeWithCombinedDistribution;
    }

    /**
     * Returns true if Compare typed mode is on
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @param {string} compareModeType type ('StandardMode', 'ScoreMode', 'DistributionMode') of Compare mode
     * @returns {boolean} indicates if Compare mode is on
     **/
    static function isInCompareModeByType(context, compareModeType) {
        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        var isInCompareTypedMode;
        try {
            switch (compareModeType) {
                case CompareUtil.standardCompareModeTypeName:
                    isInCompareTypedMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configQuestionsTriggerPropertyName);
                    if (isInCompareTypedMode) {
                        isInCompareTypedMode = false;
                        for (var i = 1; i <= CompareUtil.numberOfQuestionParameters; i++) {
                            var tempParameterName = CompareUtil.questionsParameterNamePrefix + i;
                            if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                                isInCompareTypedMode = true;
                                break;
                            }
                        }
                    }
                    break;

                case CompareUtil.scoreCompareModeTypeName:
                    isInCompareTypedMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configCombinedDistributionTriggerPropertyName);
                    if (isInCompareTypedMode) {
                        var selectedCodesForScore: String[] = ParamUtil.GetSelectedCodes(context, CompareUtil.combinedDistributionParameterName);
                        if (selectedCodesForScore.length <= 0) {
                            isInCompareTypedMode = false;
                            break;
                        }
                        var selectedCodesForScoreArrayList: ArrayList = new ArrayList();
                        selectedCodesForScoreArrayList.AddRange(selectedCodesForScore);
                        isInCompareTypedMode = selectedCodesForScoreArrayList.IndexOf(CompareUtil.scoreCode) >= 0
                    }
                    break;

                case CompareUtil.distributionCompareModeTypeName:
                    isInCompareTypedMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configCombinedDistributionTriggerPropertyName);
                    if (isInCompareTypedMode) {
                        var selectedCodesForDistribution: String[] = ParamUtil.GetSelectedCodes(context, CompareUtil.combinedDistributionParameterName);
                        if (selectedCodesForDistribution.length <= 0) {
                            isInCompareTypedMode = false;
                            break;
                        }
                        var selectedCodesForDistributionArrayList: ArrayList = new ArrayList();
                        selectedCodesForDistributionArrayList.AddRange(selectedCodesForDistribution);
                        isInCompareTypedMode = selectedCodesForDistributionArrayList.IndexOf(CompareUtil.scoreCode) < 0
                    }
                    break;
            }
        }
        catch(e) {
            isInCompareTypedMode = false; // if there's no such property for current page in Config
        }

        return isInCompareTypedMode;
    }

    /**
     * Returns current type of Compare mode (if report is in Compare mode)
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {string} compareModeType type ('StandardMode', 'ScoreMode', 'DistributionMode') of Compare mode or '' if report is not in Compare mode
     **/
    static function getCurrentTypeOfCompareMode(context) {
        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        var isInCompareTypedMode;

        try {
            isInCompareTypedMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configQuestionsTriggerPropertyName);
            if (isInCompareTypedMode) {
                isInCompareTypedMode = false;
                for (var i = 1; i <= CompareUtil.numberOfQuestionParameters; i++) {
                    var tempParameterName = CompareUtil.questionsParameterNamePrefix + i;
                    if (ParamUtil.GetSelectedCodes(context, tempParameterName).length > 0) {
                        isInCompareTypedMode = true;
                        break;
                    }
                }
            }
            if (isInCompareTypedMode) {
                return CompareUtil.standardCompareModeTypeName;
            }
        } catch(e) {
            isInCompareTypedMode = false; // if there's no such property for current page in Config
        }

        try {
            isInCompareTypedMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configCombinedDistributionTriggerPropertyName);
            if (isInCompareTypedMode) {
                var selectedCodesForScore: String[] = ParamUtil.GetSelectedCodes(context, CompareUtil.combinedDistributionParameterName);
                if (selectedCodesForScore.length <= 0) {
                    isInCompareTypedMode = false;
                    break;
                }
                var selectedCodesForScoreArrayList: ArrayList = new ArrayList();
                selectedCodesForScoreArrayList.AddRange(selectedCodesForScore);
                isInCompareTypedMode = selectedCodesForScoreArrayList.IndexOf(CompareUtil.scoreCode) >= 0
            }
            if (isInCompareTypedMode) {
                return CompareUtil.scoreCompareModeTypeName;
            }
        } catch(e) {
            isInCompareTypedMode = false; // if there's no such property for current page in Config
        }

        try {
            isInCompareTypedMode = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configCombinedDistributionTriggerPropertyName);
            if (isInCompareTypedMode) {
                var selectedCodesForDistribution: String[] = ParamUtil.GetSelectedCodes(context, CompareUtil.combinedDistributionParameterName);
                if (selectedCodesForDistribution.length <= 0) {
                    isInCompareTypedMode = false;
                    break;
                }
                var selectedCodesForDistributionArrayList: ArrayList = new ArrayList();
                selectedCodesForDistributionArrayList.AddRange(selectedCodesForDistribution);
                isInCompareTypedMode = selectedCodesForDistributionArrayList.IndexOf(CompareUtil.scoreCode) < 0
            }
            if (isInCompareTypedMode) {
                return CompareUtil.distributionCompareModeTypeName;
            }
        } catch(e) {
            isInCompareTypedMode = false; // if there's no such property for current page in Config
        }

        return '';
    }


    /**
     * Returns true if Compare CombinedDistribution mode is on
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {boolean} indicates if Compare mode is on
     **/
    static function isInCompareCombinedDistributionMode(context) {
        return CompareUtil.isInCompareModeByType(context, CompareUtil.scoreCompareModeTypeName) || CompareUtil.isInCompareModeByType(context, CompareUtil.distributionCompareModeTypeName);
    }

    /**
     * Get selected options for Compare Question parameters
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Array} options
     **/
    static function getSelectedCompareQuestionsOptions(context) {
        var options = [];

        for (var i = 1; i <= CompareUtil.numberOfQuestionParameters; i++) {
            var tempParameterName = CompareUtil.questionsParameterNamePrefix + i;
            options = options.concat(ParamUtil.GetSelectedCodes(context, tempParameterName));
        }

        return options;
    }

    /**
     * Get selected codes for Compare CombinedDistribution parameter
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Array} options
     **/
    static function getSelectedCompareCombinedDistributionCodes(context) {
        return ParamUtil.GetSelectedCodes(context, CompareUtil.combinedDistributionParameterName);
    }

    /**
     * Returns true if there's EnableCompareQuestionsSection or EnableCompareCombinedDistribution flag for current page in Config
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {boolean} isCompareSectionNeeded
     **/
    static function isCompareSectionNeeded(context) {
        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        var isCompareNeeded = false;
        try {
            isCompareNeeded = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configQuestionsTriggerPropertyName);
        }
        catch (e) { }

        var isCombinedDistributionNeeded = false;
        try {
            isCombinedDistributionNeeded = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, CompareUtil.configCombinedDistributionTriggerPropertyName);
        }
        catch (e) { }

        return isCompareNeeded || isCombinedDistributionNeeded;
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
        var parameterNamePrefix = CompareUtil.questionsParameterNamePrefix;

        for (var i=0; i<parameters.length; i++) {
            // support for multi select. If you need multi-selectors, no code changes are needed, change only parameter setting + ? list css class
            var selectedOptions = ParamUtil.GetSelectedOptions(context, parameterNamePrefix+(i+1));
            var parameterName = CompareUtil.getScriptedCompareParameterNameByOrder(context, CompareUtil.parameterTypeQuestion, i+1);

            if(selectedOptions.length>0) {
                parameterValues.push({Label: parameterName, selectedOptions: selectedOptions});
            }
        }

        var selectedCombinedDistributionOptions = ParamUtil.GetSelectedOptions(context, CompareUtil.combinedDistributionParameterName);
        if(selectedCombinedDistributionOptions.length>0) {
            parameterValues.push({Label: CompareUtil.getScriptedCompareParameterNameByOrder(context, CompareUtil.parameterTypeCombinedDistribution), selectedOptions: selectedCombinedDistributionOptions});
        }

        return parameterValues;
    }

    /**
     * Returns array of all codes for Distribution from TextLibrary
     * @param {Object} context
     * @returns {Array} Array of codes
     **/
    static function GetAllDistributionCodesFromTextLibrary(context) {
        var distributionOptions = TextAndParameterUtil.getParameterValuesByKey(CompareUtil.distributionTextPropertyName);
        var codes = [];
        for (var i = 0; i < distributionOptions.length; i++) {
            codes = codes.concat(distributionOptions[i].AnswerCodes);
        }
        return codes;
    }

    /**
     * Returns array of all codes (for recoding) for Distribution from TextLibrary
     * @param {Object} context
     * @returns {Array} Array of codes
     **/
    static function GetAllRecodedDistributionCodesFromTextLibrary(context) {
        var distributionOptions = TextAndParameterUtil.getParameterValuesByKey(CompareUtil.distributionTextPropertyName);
        var codes = [];
        for (var i = 1; i <= distributionOptions.length; i++) {
            codes.push(i);
        }
        return codes;
    }
}
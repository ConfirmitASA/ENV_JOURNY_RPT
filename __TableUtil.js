class TableUtil{

    /**
     * @memberof TableUtil
     * @function setTimeSeriesByTimeUnit
     * @description function to set time series for a header question depending on the value of parameter TimeUnitsWithDefaultValue ot TimeUnitsNoDefaultValue
     * @param {Object} context - {report: report, user: user, state: state, log: log}
     */
    static function setTimeSeriesByTimeUnit(context, headerQuestion, timeUnit){

        if (!timeUnit || !headerQuestion) {
            throw new Error("TableUtil.setTimeSeriesByTimeUnit: HeaderQuestion or TimeUnit is not defined");
        }

        var timeUnitCode = timeUnit.Code;

        switch (timeUnitCode) {
            case 'Y':
                headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
                break;

            case 'Q':
                headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
                headerQuestion.TimeSeries.Time2 = TimeseriesTimeUnitType.Quarter;
                break;

            case 'M':
                headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
                headerQuestion.TimeSeries.Time2 = TimeseriesTimeUnitType.Month;
                break;

            case 'D':
                headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
                headerQuestion.TimeSeries.Time2 = TimeseriesTimeUnitType.Month;
                headerQuestion.TimeSeries.Time3 = TimeseriesTimeUnitType.DayOfMonth;
                break;

            default:
                headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
        }

    }


    /**
     * @memberof TableUtil
     * @function setRollingByTimeUnit
     * @description function to set rolling timesseries for a header question depending on the value of parameter TimeUnitsWithDefaultValue ot TimeUnitsNoDefaultValue
     * @param {Object} context - {report: report, user: user, state: state, log: log}
     */
    static function setRollingByTimeUnit(context, headerQuestion, timeUnit){

        if (!timeUnit || !headerQuestion) {
            throw new Error("TableUtil.setRollingByTimeUnit: HeaderQuestion or TimeUnit is not defined");
        }

        var timeUnitCode = timeUnit.Code;

        headerQuestion.TimeSeries.RollingTimeseries.Enabled = true;
        headerQuestion.TimeSeries.RollingTimeseries.From = -(timeUnit.TimeUnitCount - 1);
        headerQuestion.TimeSeries.RollingTimeseries.To = 0;

        switch (timeUnitCode) {
            case 'Y':
                headerQuestion.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Year;
                break;

            case 'Q':
                headerQuestion.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Quarter;
                break;

            case 'M':
                headerQuestion.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Month;
                break;

            case 'D':
                headerQuestion.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Day;
                break;

            default:
                headerQuestion.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
        }

    }


    /**
     * @memberof TableUtil
     * @function addTrending
     * @description function to add trending by date variable to Aggregated table column
     * @param {Object} context - {table: table, report: report, user: user, state: state, log: log}
     * @param {String} qId - date question id for trending
     */
    static function addTrending(context, qId) {

        var log = context.log;
        var table = context.table;

        var timeUnits = ParamUtil.GetSelectedOptions (context, 'p_TimeUnitWithDefault');

        if (timeUnits.length) {

            // though it can be multi-parameter, use only 1 option for trend
            var timeUnit = timeUnits[0];

            // check if time unit for breakdown is specified in TextAndParameterLibrary->ParameterValuesLibrary
            if (timeUnit.TimeUnit) {

                // add trending by a date variable passed as a parameter
                var qe: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, qId);
                var timeQuestionHeader: HeaderQuestion = new HeaderQuestion(qe);
                setTimeSeriesByTimeUnit(context, timeQuestionHeader, timeUnit);

                // set rolling if time unit count is specified in TextAndParameterLibrary->ParameterValuesLibrary
                if (timeUnit.TimeUnitCount != null) {
                    setRollingByTimeUnit(context, timeQuestionHeader, timeUnit);
                }
                timeQuestionHeader.TimeSeries.FlatLayout = true;

            } else {

                //  no time units, so add trending by a single (not a date question!) specified in TextAndParameterLibrary->ParameterValuesLibrary
                qe = QuestionUtil.getQuestionnaireElement(context, timeUnit.Code);
                timeQuestionHeader = new HeaderQuestion(qe);

            }

            timeQuestionHeader.ShowTotals = false;
            timeQuestionHeader.HideData = false;
            timeQuestionHeader.HideHeader = false;

            table.RemoveEmptyHeaders.Columns = true;  //https://jiraosl.firmglobal.com/browse/TQA-4243
            table.ColumnHeaders.Add(timeQuestionHeader);

        }
    }
    /*
     * Function sets start and end date for Date header.
     * That allows to limit date interval and number of columns in table when
     * 1) RemoveEmptyHeaders Option is off and 2) Date filter is applied
     * param {object} context {report: report, user: user, state: state, log: log}
     * param {HeaderQuestion} headerDateQuestion - header based on date question
     */

    static function applyDateRangeFilterToHeader(context, headerDateQuestion) {

        if(!Filters.isTimePeriodFilterHidden(context)) {
            var dateRange = DateUtil.defineDateRangeBasedOnFilters(context);

            if(dateRange) {
                headerDateQuestion.TimeSeries.StartDate = dateRange.startDate;
                headerDateQuestion.TimeSeries.EndDate = dateRange.endDate;
            }
        }

        return;
    }

    /*
   * Function that excludes NA answer from header.
   * param {object} context {state: state, report: report, pageContext: pageContext, log: log}
   * param {Header} headerQuestion or headerCategory
   */

    static function maskOutNA(context, header) {

        var log = context.log;
        var pageId = PageUtil.getCurrentPageIdInConfig(context);
        var naCode = DataSourceUtil.getPropertyValueFromConfig(context, pageId, 'NA_answerCode');

        if(!naCode) {
            return;
        }

        if(header.HeaderType === HeaderVariableType.QuestionnaireElement) {
            var qId = header.QuestionnaireElement.QuestionId;
            var project : Project = DataSourceUtil.getProject(context);
            var q : Question = project.GetQuestion(qId);

            // additional check for Multi. Apply Mask only if a question has NA answer, otherwise Internal Server Error
            if (q.QuestionType != QuestionType.Multi || (q.QuestionType == QuestionType.Multi && QuestionUtil.hasAnswer(context, qId, naCode))) {
                var qMask : MaskFlat = new MaskFlat();
                qMask.Codes.Add(naCode);
                qMask.IsInclusive = false;
                header.AnswerMask = qMask;
                header.FilterByMask = true;
            }

        }

        if(header.HeaderType === HeaderVariableType.Categories) {
            header.IgnoreCodes = naCode;
            header.Mask.Type = MaskType.HideCodes;
            header.Mask.Codes = naCode;
        }
    }


    /*
   * Add nested header based on BreakVariables and BreakByTimeUnits properties for 'Results' page.
   * @param {object} context: {state: state, report: report, log: log, table: table, pageContext: pageContext}
   * @param {Header} parent header
   */

    static function addBreakByNestedHeader(context, parentHeader, parameterInfo) {

        var log = context.log;
        var breakByParameter = null;
        var breakByType = null;
        var nestedHeader: HeaderQuestion;
        var questionElem: QuestionnaireElement;

        if (parameterInfo) {
            breakByParameter = parameterInfo.Id;
            breakByType = parameterInfo.Type;
        } else {
            var pageId = PageUtil.getCurrentPageIdInConfig(context);
            var breakByTimeUnits = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BreakByTimeUnits');
            var breakVariables = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BreakVariables');

            if (breakByTimeUnits && breakVariables && breakVariables.length > 0) {
                throw new Error('TableUtil.addBreakByNestedHeader: only one property can be used for break by, exclude either BreakByTimeUnits or BreakVariables from config for the DS, page ' + pageId);
            }

            if (!(breakByTimeUnits || (breakVariables && breakVariables.length > 0))) { // none of break by values set in config
                return;
            }
            //TO DO: get rid of explicit page names
            if (breakByTimeUnits && pageId === 'Page_Results') {
                breakByParameter = 'p_TimeUnitNoDefault';
                breakByType = 'TimeUnit';
            } else if (breakByTimeUnits && pageId === 'Page_Categorical_') {
                breakByParameter = 'p_CatDD_TimeUnitNoDefault';
                breakByType = 'TimeUnit';
            } else if (breakByTimeUnits && pageId === 'Page_CategoricalDrilldown') {
                breakByParameter = 'p_CatDD_TimeUnitNoDefault';
                breakByType = 'TimeUnit';
            } else if (breakVariables && breakVariables.length > 0 && pageId === 'Page_Results') {
                breakByParameter = 'p_Results_BreakBy';
                breakByType = 'Question';
            } else if (breakVariables && breakVariables.length > 0 && pageId === 'Page_Categorical_') {
                breakByParameter = 'p_CategoricalDD_BreakBy';
                breakByType = 'Question';
            } else if (breakVariables && breakVariables.length > 0 && pageId === 'Page_CategoricalDrilldown') {
                breakByParameter = 'p_CategoricalDD_BreakBy';
                breakByType = 'Question';
            }
        }

        var selectedOptions = ParamUtil.GetSelectedOptions(context, breakByParameter)[0];
        var selectedOption = selectedOptions[0];

        if(selectedOption==null || selectedOption.Code === 'na') {//no break by option is selected
            return;
        }

        if(breakByType === 'TimeUnit') { // break by time unit

            var qid = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'DateQuestion');

            questionElem = QuestionUtil.getQuestionnaireElement(context, qid);
            nestedHeader = new HeaderQuestion(questionElem);
            nestedHeader.ShowTotals = false;
            nestedHeader.TimeSeries.FlatLayout = true;

            nestedHeader.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
            if(selectedOption.TimeUnit === 'Quarter') {
                nestedHeader.TimeSeries.Time2 = TimeseriesTimeUnitType.Quarter;
            } else if(selectedOption.TimeUnit === 'Month') {
                nestedHeader.TimeSeries.Time2 = TimeseriesTimeUnitType.Month;
            } else if(selectedOption.TimeUnit === 'Day') {
                nestedHeader.TimeSeries.Time2 = TimeseriesTimeUnitType.Month;
                nestedHeader.TimeSeries.Time3 = TimeseriesTimeUnitType.DayOfMonth;
            }

            TableUtil.applyDateRangeFilterToHeader(context, nestedHeader);
            parentHeader.SubHeaders.Add(nestedHeader);

            return;
        }

        if(breakByType === 'Question') { // break by question

            var questionInfo = QuestionUtil.getQuestionInfo(context, selectedOption.Code);

            questionElem = QuestionUtil.getQuestionnaireElement(context, selectedOption.Code);
            nestedHeader = new HeaderQuestion(questionElem);

            if(questionInfo.standardType === 'hierarchy') { // the same code exists in __PageResponseRate by demographics function :(
                nestedHeader.ReferenceGroup.Enabled = true;
                nestedHeader.ReferenceGroup.Self = false;
                nestedHeader.ReferenceGroup.Levels = HierarchyUtil.getParentsForCurrentHierarchyNode(context).length+1;
            }

            nestedHeader.ShowTotals = false;
            parentHeader.SubHeaders.Add(nestedHeader);

            return;
        }

        if(breakByType === 'Answer') { // break by question's answer

            var questionId;
            // change second parameter of slice function if Compare parameters have more than 9 copies
            var parameterIdWithoutNumber = breakByParameter.slice(0, -1);
            if (parameterIdWithoutNumber === 'p_ScriptedBBCompareParameter') {
                // change third parameter of getCompareQuestionIdFromConfig function if Compare parameters have more than 9 copies
                questionId = CompareUtil.getCompareQuestionIdFromConfig(context, 'BreakBy', breakByParameter[breakByParameter.length - 1]);
            }

            var questionInfo = QuestionUtil.getQuestionInfo(context, questionId);
            questionElem = QuestionUtil.getQuestionnaireElement(context, questionId);
            nestedHeader = new HeaderQuestion(questionElem);

            if(questionInfo.standardType === 'hierarchy') { // the same code exists in __PageResponseRate by demographics function :(
                nestedHeader.ReferenceGroup.Enabled = true;
                nestedHeader.ReferenceGroup.Self = false;
                nestedHeader.ReferenceGroup.Levels = HierarchyUtil.getParentsForCurrentHierarchyNode(context).length+1;
            }

            var breakByMask: MaskFlat = new MaskFlat();
            breakByMask.IsInclusive = true;
            for (var i = 0; i < selectedOptions.length; i++) {
                breakByMask.Codes.Add(selectedOptions[i].Code);
            }
            nestedHeader.AnswerMask = breakByMask;

            nestedHeader.ShowTotals = false;

            parentHeader.SubHeaders.Add(nestedHeader);

            return;
        }
    }

    /**
     *Function adds AVG and Base subheader to a
     *@param {object} context
     *@param {Header} parent header
     */

    static function getTrendQuestionHeader(context, qid) {

        var report = context.report;

        var qe: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, qid);
        var qTitle = QuestionUtil.getQuestionTitle (context, qid);
        var row: HeaderQuestion = new HeaderQuestion(qe);
        row.IsCollapsed = true;
        row.HideHeader = true;
        maskOutNA(context, row);

        // Average must be the 1st row
        var hsAvg : HeaderStatistics = new HeaderStatistics();
        hsAvg.Statistics.Avg = true;
        hsAvg.Statistics.Count = false;
        hsAvg.HideHeader = true;
        hsAvg.Texts.Average = new Label(report.CurrentLanguage, qTitle+' ('+TextAndParameterUtil.getTextTranslationByKey(context, 'Avg')+')');
        row.SubHeaders.Add(hsAvg);

        // Number of responses is in the 2nd row
        var hsN : HeaderStatistics = new HeaderStatistics();
        hsN.Statistics.Avg = false;
        hsN.Statistics.Count = true;
        hsN.HideHeader = true;
        hsN.Texts.Count = new Label(report.CurrentLanguage, qTitle+' ('+TextAndParameterUtil.getTextTranslationByKey(context, 'N')+')');
        row.SubHeaders.Add(hsN);

        return row;
    }


}
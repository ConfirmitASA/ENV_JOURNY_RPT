class PageCategorical {

    /**
     * @memberof PageCategorical
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context) {
        return false;
    }


    /**
     * @memberof PageCategorical
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context) {

        var report = context.report;
        var state = context.state;
        var log = context.log;
        var text = context.text;

        var dsId = DataSourceUtil.getDsId(context);

        var drilldownId = !state.Parameters.IsNull("p_Drilldown") && state.Parameters.GetString("p_Drilldown") ? state.Parameters.GetString("p_Drilldown") : '';

        var drilldownDSId = drilldownId.split(":")[0];
        if (drilldownDSId != dsId) {
            drilldownId = '';
            state.Parameters["p_Drilldown"] = new ParameterValueResponse();
        }
    }


    /**
     * @memberof PageCategorical
     * @function tileCategorical_Hide
     * @description function to hide the Categorical tiles (cards). More precisely, to hide the script generating cards
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tileCategorical_Hide(context) {
        return SuppressUtil.isGloballyHidden(context);
    }


    /**
     * @memberof PageCategorical
     * @function tableCategorical_Hide
     * @description function to hide the table
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tableCategorical_Hide(context) {
        return false;
    }

    /**
     * @memberof PageCategorical
     * @function tableCategorical_Render
     * @description function to build the categorical table
     * @param {Object} context - {table: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log, suppressSettings: suppressSettings}
     */
    static function tableCategorical_Render(context, tableType) {

        var report = context.report;
        var state = context.state;
        var table = context.table;
        var log = context.log;
        var suppressSettings = context.suppressSettings;
        var pageId = PageUtil.getCurrentPageIdInConfig(context);
        var project: Project = DataSourceUtil.getProject(context);
        var questionConfigParamName = tableType == 'multi' ? 'ResultMultiCategoricalQuestions' : 'ResultCategoricalQuestions';

        // add rows (single or multi questions)
        var Qs = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, questionConfigParamName);
        var topN = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, "topN");
        var naCode = DataSourceUtil.getPropertyValueFromConfig(context, pageId, 'NA_answerCode');

        for (var i = 0; i < Qs.length; i++) {

            var question: Question = project.GetQuestion(Qs[i]);
            var answerCount = question.AnswerCount;
            if (QuestionUtil.hasAnswer(context, Qs[i], naCode)) {
                answerCount--;
            }

            var qe: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, Qs[i]);
            var row: HeaderQuestion = new HeaderQuestion(qe);

            row.IsCollapsed = (tableType == 'multi') ? true : false;

            row.ShowTitle = true;//false; - changed to true for excel export
            row.ShowTotals = false;
            row.HideHeader = true;

            // sorting by base to show the most popular answers
            row.Sorting.Enabled = true;
            row.Sorting.Direction = TableSortDirection.Descending;
            row.Sorting.Position = 1;
            row.Sorting.TopN = topN;

            TableUtil.maskOutNA(context, row);
            table.RowHeaders.Add(row);
        }

        if (table.ColumnHeaders.Count == 0) { // temporary solution to avoid multiple addition of columns for Excel Categorical table

            // add 2 Base columns and 2 Segments to change the standard Base titles for Excel Export

            var baseVP: HeaderBase = new HeaderBase();
            baseVP.Distributions.Enabled = true;
            baseVP.Distributions.VerticalPercents = true;
            baseVP.Distributions.UseInnermostTotals = true;
            baseVP.HideHeader = true;
            var hsVP: HeaderSegment = new HeaderSegment(TextAndParameterUtil.getLabelByKey(context, 'Frequence'), '');
            hsVP.DataSourceNodeId = DataSourceUtil.getDsId (context);
            hsVP.SubHeaders.Add(baseVP);
            table.ColumnHeaders.Add(hsVP);

            var baseC: HeaderBase = new HeaderBase();
            baseC.Distributions.Enabled = true;
            baseC.Distributions.Count = true;
            baseC.HideHeader = true;
            var hsC: HeaderSegment = new HeaderSegment(TextAndParameterUtil.getLabelByKey(context, 'Number'), '');
            hsC.DataSourceNodeId = DataSourceUtil.getDsId (context);
            hsC.SubHeaders.Add(baseC);
            table.ColumnHeaders.Add(hsC);
        }

        // global table settings

        table.Caching.Enabled = false;
        table.RemoveEmptyHeaders.Columns = false;
        table.RemoveEmptyHeaders.Rows = false;
        SuppressUtil.setTableSuppress(table, suppressSettings);
    }


    /**
     * @memberof PageCategorical
     * @function tableSingleCategorical_Render
     * @description function to build the categorical table
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log, suppressSettings: suppressSettings}
     */
    static function tableSingleCategorical_Render(context) {
        tableCategorical_Render(context, 'single');
    }

    /**
     * @memberof PageCategorical
     * @function tableMultiCategorical_Render
     * @description function to build the categorical table
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log, suppressSettings: suppressSettings}
     */
    static function tableMultiCategorical_Render(context) {
        tableCategorical_Render(context, 'multi');
    }


    /**
     * @memberof PageCategorical
     * @function getCategoricalResult
     * @description function to get the array of categorical questions with answers
     * @param {Object} context - {report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} tableType - 'single' or 'multi' categoricals
     * @return {Object[]} - array of objects containing information about categoricals:
     * @property {String} qid - Question Id
     * @property {String} title - Question title
     * @property {String} type - pie or list
     * @property {Int} order - the index of question in Config (used in the sorting function to preserve the order of elements of the same type so they appear as they are listed in Config)
     * @property {Object[]} result - array of objects containing information about answers to a categorical question:
     * @property {String} name - answer text
     * @property {String} base - # of responses
     * @property {String} y - vertical percent
     */
    static function getCategoricalResult(context, tableType) {

        var report = context.report;
        var state = context.state;
        var log = context.log;
        var pageId = PageUtil.getCurrentPageIdInConfig(context);

        // show topN answers in a list for questions
        var topN = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, "topN");
        var project: Project = DataSourceUtil.getProject(context);
        var tableName = (tableType == 'multi') ? 'Multicategorical' : 'Categorical';
        var questionConfigParamName = (tableType == 'multi') ? 'ResultMultiCategoricalQuestions' : 'ResultCategoricalQuestions';
        var naCode = DataSourceUtil.getPropertyValueFromConfig(context, pageId, 'NA_answerCode');
        var Qs = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, questionConfigParamName);
        var row_index = 0;  // iterator through table rows
        var categoricals = [];
        for (var i = 0; i < Qs.length; i++) {

            var question: Question = project.GetQuestion(Qs[i]);
            var answerCount = question.AnswerCount;

            if (QuestionUtil.hasAnswer(context, Qs[i], naCode)) {
                answerCount--;
            }
            var title = QuestionUtil.getQuestionTitle(context, Qs[i]);
            var displayType = 'list';
            var displayNumberOfAnswers = System.Math.Min(topN, answerCount);
            var result = [];
            for (var j = 0; j < displayNumberOfAnswers; j++) {

                var answerBase = report.TableUtils.GetCellValue(tableName, row_index + j + 1, 2).Value.toFixed(0);

                if (answerBase > 0) {  //display only answers with responses
                    var answerName = report.TableUtils.GetRowHeaderCategoryTitles(tableName)[row_index + j][0];
                    var answerPercent = (100 * report.TableUtils.GetCellValue(tableName, row_index + j + 1, 1).Value);
                    result.push({name: answerName, base: answerBase, y: answerPercent});

                }
            }
            categoricals.push({qid: Qs[i], title: title, type: displayType, result: result, order: i});
            row_index += displayNumberOfAnswers;

        }

        return categoricals;
    }


    /**
     * @memberof PageCategorical
     * @function getPieCollection
     * @description function to get the array of categorical questions with pie view
     * @param {Object} context - {report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @return {Object[]} - array of objects containing information about categoricals with pie view
     */
    static function getPieCollection(context) {
        var log = context.log;
        var singleCategoricals = getCategoricalResult(context, 'single');
        singleCategoricals.sort(SortCategoricals);
        var pieCollection = [];
        for (var i = 0; i < singleCategoricals.length; i++) {
            if (singleCategoricals[i].type != 'pie')
                break;
            pieCollection.push(singleCategoricals[i]);
        }

        return pieCollection;
    }


    /**
     * @memberof PageCategorical
     * @function getTopListCollection
     * @description function to get the array of single-/multi- categorical questions with list view
     * @param {Object} context - {report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @return {Object[]} array of objects containing information about categoricals with Top X list view
     */
    static function getTopListCollection(context) {

        var report = context.report;
        var state = context.state;
        var log = context.log;

        var singleCategoricals = getCategoricalResult(context, 'single');
        var multiCategoricals = getCategoricalResult(context, 'multi');
        singleCategoricals.sort(SortCategoricals);
        var listCollection = [];
        for (var i = 0; i < singleCategoricals.length; i++) {
            if (singleCategoricals[i].type == 'list') {
                listCollection.push(singleCategoricals[i]);
            }
        }

        return listCollection.concat(multiCategoricals);
    }


    /**
     * @memberof PageCategorical
     * @function SortCategoricals
     * @description sorting function. Regardless of the order qIds in Config, display pie-questions first
     * @param {Object} a - object representing a categorical question
     * @param {Object} b - object representing a categorical question
     * @return {Int}
     */
    static function SortCategoricals(a, b) {
        if (a.type != b.type && a.type === 'pie') return -1;
        if (a.type != b.type && a.type === 'list') return 1;
        if (a.type == b.type) {  // preserve the order of elements of the same type (so they appear as they are listed in Config)
            if (a.order < b.order)
                return -1;
            return 1;
        }
    }


    /**
     * @memberof PageCategorical
     * @function buildCategoricalTiles
     * @description function to generate material cards with categories
     * @param {Object} context - {report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function buildCategoricalTiles(context) {

        var report = context.report;
        var state = context.state;
        var log = context.log;
        var text = context.text;

        var pageId = PageUtil.getCurrentPageIdInConfig(context);
        var dsId = DataSourceUtil.getDsId(context);

        var lists = getTopListCollection(context);

        for (var i = 0; i < lists.length; i++) {
            var item = lists[i];

            var drilldownId = !state.Parameters.IsNull('p_Drilldown') && state.Parameters.GetString('p_Drilldown') ? state.Parameters.GetString('p_Drilldown') : '';
            var isThisCardDrilldowned = drilldownId && drilldownId == dsId + ':' + item.qid;

            var content = {
                header: '<span class="card__title">' + TextAndParameterUtil.getTextTranslationByKey(context, 'Page_Categorical_TopAnswers') + '</span>' +
                    '<h2 class="card__subtitle">' + item.title + '</h2>',
                data: '',
                footer: item.result.length != 0 ? '<div id="categorical-button-' + dsId + ':' + item.qid + '" class="rpt-button redesigned-button">' + (!isThisCardDrilldowned ? TextAndParameterUtil.getTextTranslationByKey(context, 'ShowMore') : TextAndParameterUtil.getTextTranslationByKey(context, 'ShowLess')) + '</div>' : ''
            };

            if (item.result.length != 0) {
                content.data = '<div class="card__line-list line-list">';
                for (var j = 0; j < item.result.length; j++) {
                    var percent = (item.result[j].y).toFixed(0);
                    var count = item.result[j].base;

                    content.data +=
                        '<div class="line-list__item">' +
                        '	<label>' + item.result[j].name + '</label>' +
                        '	<div class="line-list__item__line">' +
                        '		<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 100 4">' +
                        '			<line x1="1" y1="2" x2="99" y2="2" stroke="' + Config.categoricalCardLineBackgroundColor + '" stroke-linecap="round" stroke-width="1.7"></line>' +
                        (percent != 0 && '<line x1="1" y1="2" x2="' + (98 / 100) * percent + '" y2="2" stroke="' + Config.categoricalCardLineColor + '" stroke-linecap="round" stroke-width="1.7"></line>') +
                        '		</svg>' +
                        '	</div>' +
                        '	<div class="line-list__item__footer">' + percent + '%' + '<span class="line-list__item__footer__description">' + ' (' + count + ' responses)' + '</span>' + '</div>' +
                        '</div>';
                }
                content.data += '</div>';

            } else {
                content.data = '<div>' + TextAndParameterUtil.getTextTranslationByKey(context, 'NoDataMsg') + '</div>';
            }

            CardUtil.RenderRedesignedCard(context, content, 'layout__card_small card_medium card_type_categorical' + (drilldownId && !isThisCardDrilldowned ? ' card_blurred' : '') + (isThisCardDrilldowned ? ' card_active' : '') + (item.result.length == 0 ? ' card_no-data' : ''));
        }
    }


    /**
     * @memberof PageCategorical
     * @function tableDrilldown_Hide
     * @description function to hide the table.
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tableDrilldown_Hide(context) {
        var state = context.state;
        var log = context.log;

        var isDrilledDown = !state.Parameters.IsNull('p_Drilldown') && state.Parameters.GetString('p_Drilldown');
        if (isDrilledDown) {
            var drillDownQId = state.Parameters.GetString('p_Drilldown').split(":")[1];
            var lists = getTopListCollection(context);
            for (var i = 0; i < lists.length; i++) {
                var item = lists[i];
                if(drillDownQId == item.qid) {
                    if(item.result.length == 0) {
                        return true; // when no data for the drilled down question (the 30 answers rule is not fulfilled), we hide the Drilldown table
                    } else {
                        break;       // when we have data, check other conditions
                    }
                }
            }
        }
        var isExcel = state.ReportExecutionMode == ReportExecutionMode.ExcelExport;
        return isExcel || !isDrilledDown || SuppressUtil.isGloballyHidden(context);
    }


    /**
     * @memberof PageCategorical
     * @function tableDrilldown_Render
     * @description function to build Categorical Drilldown table
     * @param {Object} context - {table: table, report: report, user: user, state: state, confirmit: confirmit, log: log, suppressSettings: suppressSettings}
     */

    static function tableDrilldown_Render(context) {

        var report = context.report;
        var state = context.state;
        var log = context.log;
        var table = context.table;
        var suppressSettings = context.suppressSettings;

        var pageId = PageUtil.getCurrentPageIdInConfig(context);

        // add row  = header question
        var drillDownQId = !state.Parameters.IsNull('p_Drilldown') && state.Parameters.GetString('p_Drilldown') ? state.Parameters.GetString('p_Drilldown').split(":")[1] : '';
        var qe : QuestionnaireElement =  QuestionUtil.getQuestionnaireElement(context, drillDownQId);
        var project : Project = DataSourceUtil.getProject(context);
        var question : Question = project.GetQuestion(drillDownQId);
        var row : HeaderQuestion = new HeaderQuestion(qe);
        TableUtil.maskOutNA(context, row);
        row.IsCollapsed = (question.QuestionType === QuestionType.Single) ? false : true;
        row.ShowTitle = false;
        row.ShowTotals = false;

        //TableUtil.addBreakByNestedHeader(context, row); //old implementation before change of nesting

        // Break By option is selected
        if (!state.Parameters.IsNull('p_CatDD_TimeUnitNoDefault')) {
            var timeUnits = ParamUtil.GetSelectedOptions (context, 'p_CatDD_TimeUnitNoDefault');
            if (timeUnits.length && timeUnits[0].TimeUnit) {  // check if time unit for breakdown is specified in TextAndParameterLibrary->ParameterValuesLibrary
                var timeUnit = timeUnits[0];
                // add trending by a date variable passed as a parameter
                var dateQId = DataSourceUtil.getSurveyPropertyValueFromConfig (context, 'DateQuestion');
                var dateQe: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, dateQId);
                var timeQuestionHeader: HeaderQuestion = new HeaderQuestion(dateQe);
                TableUtil.setTimeSeriesByTimeUnit(context, timeQuestionHeader, timeUnit);

                // set rolling if time unit count is specified in TextAndParameterLibrary->ParameterValuesLibrary
                if (timeUnit.TimeUnitCount != null) {
                    TableUtil.setRollingByTimeUnit(context, timeQuestionHeader, timeUnit);
                }
                timeQuestionHeader.TimeSeries.FlatLayout = true;
                timeQuestionHeader.ShowTotals = false;
                timeQuestionHeader.HideData = false;
                timeQuestionHeader.HideHeader = false;

                timeQuestionHeader.SubHeaders.Add(row);
                table.RowHeaders.Add(timeQuestionHeader);
            }

        } else {  // Break By option is not selected
            table.RowHeaders.Add(row);
        }

        // add columns = bar chart, Count and VP
        var barChartColors = Config.barChartColors_Categorical;
        var barChart: HeaderChartCombo = new HeaderChartCombo();
        var chartValue: ChartComboValue = new ChartComboValue();
        chartValue.Expression = 'if(cellv(col+1, row) > 0, cellv(col+1, row), emptyv())';
        chartValue.BaseColor = new ChartComboColorSet([barChartColors[0].color]);
        chartValue.CssClass = 'barchart__bar barchart__bar_type_distribution';
        var chartEmptyPart: ChartComboValue = new ChartComboValue();
        chartEmptyPart.Expression = 'if(cellv(col+1, row) > 0 && (max(colv(1, rows, c, col+1)) - cellv(col+1, row)) > 0, max(colv(1, rows, c, col+1)) - cellv(col+1, row), emptyv())';
        chartEmptyPart.BaseColor = new ChartComboColorSet([barChartColors[1].color]);
        chartEmptyPart.CssClass = 'barchart__bar barchart__bar_type_distribution';
        barChart.Values = [chartValue, chartEmptyPart];
        barChart.TypeOfChart = ChartComboType.Bar100;
        barChart.Title = TextAndParameterUtil.getLabelByKey(context, 'Distribution');
        table.ColumnHeaders.Add(barChart);

        var hbCount : HeaderBase = new HeaderBase();
        hbCount.Distributions.Enabled = true;
        hbCount.Distributions.Count = true;
        hbCount.Distributions.UseInnermostTotals = true;
        hbCount.HideHeader = true;

        var hbVP : HeaderBase = new HeaderBase();
        hbVP.Distributions.Enabled = true;
        hbVP.Distributions.VerticalPercents = true;
        hbVP.Decimals = Config.Decimal;
        hbVP.Distributions.UseInnermostTotals = true;
        hbVP.HideHeader = true;

        var hcCount : HeaderSegment = new HeaderSegment(TextAndParameterUtil.getLabelByKey(context, 'ResponseCounts'), '');
        hcCount.DataSourceNodeId = DataSourceUtil.getDsId(context);
        hcCount.SubHeaders.Add(hbCount);
        table.ColumnHeaders.Add(hcCount);

        var hcVP : HeaderSegment = new HeaderSegment(TextAndParameterUtil.getLabelByKey(context, 'ResponseFrequency'), '');
        hcVP.DataSourceNodeId = DataSourceUtil.getDsId(context);
        hcVP.SubHeaders.Add(hbVP);
        table.ColumnHeaders.Add(hcVP);

        // global table settings
        table.RemoveEmptyHeaders.Rows = true;
        table.Sorting.Rows.SortByType = TableSortByType.Position;
        table.Sorting.Rows.Position = 2;
        table.Sorting.Rows.Direction = TableSortDirection.Descending;
        table.Sorting.Rows.Enabled = true;
        table.RowNesting = TableRowNestingType.Nesting;
        SuppressUtil.setTableSuppress(table, suppressSettings);
    }

    /**
     * @memberof PageCategorical
     * @function tableDrilldownTitle_Hide
     * @description function to hide the table title.
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tableDrilldownTitle_Hide(context) {
        var state = context.state;
        var isDrilledDown = !state.Parameters.IsNull('p_Drilldown') && state.Parameters.GetString('p_Drilldown');
        return !isDrilledDown || SuppressUtil.isGloballyHidden(context);
    }


    /**
     * @memberof PageCategorical
     * @function tableDrilldownTitle_Render
     * @description function to build Categorical Drilldown table title with question text
     * @param {Object} context - {table: table, report: report, user: user, state: state, confirmit: confirmit, log: log, suppressSettings: suppressSettings}
     */

    static function tableDrilldownTitle_Render(context){

        var report = context.report;
        var state = context.state;
        var log = context.log;
        var text = context.text;

        var drilldownId = !state.Parameters.IsNull('p_Drilldown') && state.Parameters.GetString('p_Drilldown') ? state.Parameters.GetString('p_Drilldown').split(":")[1] : '';
        var project : Project = DataSourceUtil.getProject(context);
        var qe: QuestionnaireElement = new QuestionnaireElement(project, drilldownId);
        var q: Question = project.GetQuestion(qe);

        text.Output.Append(q.Text);
    }
}
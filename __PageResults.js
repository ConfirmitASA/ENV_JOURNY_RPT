class PageResults {

  /*
* Add distribution postfix ('Score' or codes) to table title
* @param {object} context: {state: state, report: report, log: log, table: table, pageContext: pageContext, suppressSettings: suppressSettings}
*/
  static function addDistributionPostfixToTitle(context) {
    var text = context.text;

    if (CompareUtil.isInCompareModeByType(context, CompareUtil.scoreCompareModeTypeName)) {
      text.Output.Append(' (' + TextAndParameterUtil.getTextTranslationByKey(context, 'Score') + ')');
    } else if(CompareUtil.isInCompareModeByType(context, CompareUtil.distributionCompareModeTypeName)) {
      var distributionOptions = ParamUtil.GetSelectedOptions(context, CompareUtil.combinedDistributionParameterName);
      if (distributionOptions && distributionOptions.length > 0) {
        var distributionLabels = [];
        for (var i = 0; i < distributionOptions.length; i++) {
          distributionLabels.push(distributionOptions[i].Label);
        }
        text.Output.Append(' (' + TextAndParameterUtil.getTextTranslationByKey(context, 'Distribution') + ' ' + distributionLabels.join(', ') + ')');
      }
    }
  }

  /*
* Assemble Statements table
* @param {object} context: {state: state, report: report, log: log, table: table, pageContext: pageContext, suppressSettings: suppressSettings}
* @param {string} bannerId: explicit bannerId to use, not mandotary
*/
  static function tableStatements_Render(context, bannerId) {

    var state = context.state;
    var table = context.table;
    var log = context.log;
    var suppressSettings = context.suppressSettings;


    PageResults.tableStatements_AddColumns(context, bannerId);
    PageResults.tableStatements_AddRows(context);
    //setSuppress(context, table, suppressSettings);

    PageResults.tableStatements_ApplyConditionalFormatting(context);

    table.RemoveEmptyHeaders.Rows = true;
    table.RemoveEmptyHeaders.Columns = true;

    table.Decimals = 0;
    table.RowNesting = TableRowNestingType.Nesting;
    table.Caching.Enabled = false;

  }

  /**
   * define table suppress settings here
   */
  static function setSuppress(context, table, suppressSettings) {

    SuppressUtil.setTableSuppress(table, suppressSettings);

    if(CompareUtil.isInCompareMode(context)) {
      suppressSettings.type = 'row'; //in compare mode we use different direction
    }

  }

  /*
* Hide Statements table because of suppress
* @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function tableStatements_Hide(context) {
    return SuppressUtil.isGloballyHidden(context);
  }


  /*
* Column Banner selector for Statements table
* @param {object} context: {state: state, report: report, log: log, table: table}
* @param {string} bannerId: explicit bannerId to use, not mandatory
*/
  static function tableStatements_AddColumns(context, bannerId) {

    var log = context.log;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);

    if(CompareUtil.isInCompareCombinedDistributionMode(context)) {
      PageResults.tableStatements_AddColumnsInCompareMode(context);
    } else {
      PageResults.tableStatements_AddColumns_Banner0(context);
    }
    return;
  }

  /*
* Add set of rows based on questions or categorizations (for pulse)
* @param {object} context: {state: state, report: report, log: log, table: table}
*/

  static function tableStatements_AddRows(context) {

    var log = context.log;
    var table = context.table;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);
    var resultStatements = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'ResultStatements');
    var dimensions = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'Dimensions');

    if(resultStatements && resultStatements.length>0 && dimensions && dimensions.length>0) {
      throw new Error('PageResults.tableStatements_AddRows: One of Config properties for page "Results" ResultStatements and Dimensions should be null or [].');
    }

    if(resultStatements && resultStatements.length>0) {
      PageResults.tableStatements_AddRows_Banner0(context);
      return;
    }

    if(dimensions && dimensions.length>0) {
      PageResults.tableStatements_AddRows_Banner1(context);
      return;
    }

    throw new Error('PageResults.tableStatements_AddRows: No data to build rows. Please check ResultStatements and Dimensions properties for page Results.');
  }

  /*
* Add statement questions as table rows based on Survey Config-> Page_Result-> ResultStatements
*  @param {object} context: {state: state, report: report, log: log, table: table}
*/

  static function tableStatements_AddRows_Banner0(context) {

    var state = context.state;
    var table = context.table;
    var log = context.log;
    var questions = DataSourceUtil.getPagePropertyValueFromConfig(context, PageUtil.getCurrentPageIdInConfig(context), 'ResultStatements');

    for(var i=0; i<questions.length; i++) {
      var questionnaireElement : QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, questions[i]);
      var headerQuestion : HeaderQuestion = new HeaderQuestion(questionnaireElement);
      headerQuestion.IsCollapsed = true;
      TableUtil.maskOutNA(context, headerQuestion);
      if (!CompareUtil.isInCompareMode(context)) {
        TableUtil.addBreakByNestedHeader(context, headerQuestion);
      }
      table.RowHeaders.Add(headerQuestion);
    }
  }


  /*
* Add categorizations as table rows based on Survey Config-> Page_Result-> Dimensions property
*  @param {object} context: {state: state, report: report, log: log, table: table}
*/

  static function tableStatements_AddRows_Banner1(context) {

    var report = context.report;
    var state = context.state;
    var table = context.table;
    var log = context.log;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);

    // this fixes break by recoding for categorizations in rows
    var helpQuestionQE: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context,
        DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'CategorizationHelpQuestion'));
    var helpQuestionHQ: HeaderQuestion = new HeaderQuestion(helpQuestionQE);
    helpQuestionHQ.HideData = true;
    helpQuestionHQ.HideHeader = true;
    helpQuestionHQ.IsCollapsed = true;
    table.RowHeaders.Add(helpQuestionHQ);

    var categorizations = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'Dimensions');

    for (var i=0; i<categorizations.length; i++) {

      var categorization : HeaderCategorization = new HeaderCategorization();
      categorization.CategorizationId = categorizations[i];
      categorization.DataSourceNodeId = DataSourceUtil.getDsId(context);
      categorization.DefaultStatistic = StatisticsType.Average;
      categorization.CalculationRule = CategorizationType.AverageOfAggregates; // AvgOfIndividual affects performance
      categorization.Preaggregation = PreaggregationType.Average;
      categorization.SampleRule = SampleEvaluationRule.Max;// https://jiraosl.firmglobal.com/browse/TQA-4116
      categorization.Collapsed = false;
      categorization.Totals = true;

      //TableUtil.maskOutNA(context, categorization); // exclude NA code

      if (!CompareUtil.isInCompareMode(context)) {
        TableUtil.addBreakByNestedHeader(context, categorization);
      }
      table.RowHeaders.Add(categorization);
    }

    table.TotalsFirst = true;
  }


  /*
* Add set of columns: Score, distribution barChart, Scale Distribution, Responses, Benchmarks, Benchmark comparison bar chart, hierarchy comparison columns
* @param {object} context: {state: state, report: report, log: log, table: table}
* @param {string} scoreType
*/
  static function tableStatements_AddColumns_Banner0(context) {

    var log = context.log;

    // add Score column
    PageResults.addScore(context);
    //add distribution barChart
    PageResults.addDistributionBarChart(context);
    // add Responses Column
    PageResults.addResponsesColumn(context);
    // add Benchmark related columns
    PageResults.tableStatements_AddBenchmarkColumns_Banner0(context);
  }

  /*
* Add Score calculation
* @param {object} context: {state: state, report: report, log: log, table: table}
* @param {string} scoreType: 'avg', '%fav', '%fav-%unfav'
* @param {Header} parentHeader - not mandotary
* @param {Array} [Header1, Header2,...]
*/
  static function addScore(context, parentHeader) {

    var table = context.table;
    var state = context.state;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);
    var scoreType = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'ScoreType');

    scoreType = scoreType.toLowerCase();

    if(scoreType === 'avg')	{

      // add Score column
      var avg: HeaderFormula = new HeaderFormula();
      avg.Type = FormulaType.Expression;
      avg.Expression = 'cellv(col+1, row)';
      avg.Decimals = 0;
      // avg.Title = TextAndParameterUtil.getLabelByKey(context, 'Score');

      var score: HeaderStatistics = new HeaderStatistics();
      score.Decimals = 0;
      score.Statistics.Avg = true;
      score.HideData = true;
      //score.Texts.Average = TextAndParameterUtil.getLabelByKey(context, 'Score');

      if(CompareUtil.isInCompareMode(context) && !Export.isExportMode(context)) {
        avg.Title = TextAndParameterUtil.getLabelByKey(context, 'Total');
        score.Texts.Average = TextAndParameterUtil.getLabelByKey(context, 'Total');
      } else {
        avg.Title = TextAndParameterUtil.getLabelByKey(context, 'Score');
        score.Texts.Average = TextAndParameterUtil.getLabelByKey(context, 'Score');
      }

      if(parentHeader) {
        parentHeader.SubHeaders.Add(avg);
        parentHeader.SubHeaders.Add(score);
      } else {
        table.ColumnHeaders.Add(avg);
        table.ColumnHeaders.Add(score);
      }
      return [score];
    }

    var bcCategories: HeaderCategories = new HeaderCategories();

    if(scoreType === '%fav') {

      // add Score column
      var posScoreRecodingCols = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'ReusableRecoding_PositiveCols');
      var fav: HeaderFormula = new HeaderFormula();
      fav.Type = FormulaType.Expression;
      fav.Expression = 'cellv(col+'+posScoreRecodingCols.join(', row)+cellv(col+')+',row)';
      fav.Decimals = 0;
      //fav.Title = TextAndParameterUtil.getLabelByKey(context, 'Fav');

      //add distribution barChart
      bcCategories.RecodingIdent = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'ReusableRecodingId');
      bcCategories.Totals = false;
      bcCategories.Distributions.Enabled = true;
      bcCategories.Distributions.HorizontalPercents = true;
      bcCategories.Decimals = 0;
      bcCategories.HideData = true;

      if(CompareUtil.isInCompareMode(context) && !Export.isExportMode(context)) {
        fav.Title = TextAndParameterUtil.getLabelByKey(context, 'Total');
      } else {
        fav.Title = TextAndParameterUtil.getLabelByKey(context, 'Fav');
      }

      if(parentHeader) {
        parentHeader.SubHeaders.Add(fav);
        parentHeader.SubHeaders.Add(bcCategories);
      } else {
        table.ColumnHeaders.Add(fav);
        table.ColumnHeaders.Add(bcCategories);
      }
      return [fav, bcCategories];
    }

    if(scoreType === '%fav-%unfav') {

      // add Score column
      var posScoreRecodingCols = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'ReusableRecoding_PositiveCols');
      var negScoreRecodingCols = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'ReusableRecoding_NegativeCols');
      var diff: HeaderFormula = new HeaderFormula();
      diff.Type = FormulaType.Expression;
      diff.Expression = 'cellv(col+'+posScoreRecodingCols.join(', row)+cellv(col+')+',row) - cellv(col+'+negScoreRecodingCols.join(', row)-cellv(col+')+',row)';
      diff.Decimals = 0;
      //diff.Title = TextAndParameterUtil.getLabelByKey(context, 'FavMinUnfav');

      //add distribution barChart
      bcCategories.RecodingIdent = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'ReusableRecodingId');
      bcCategories.Totals = false;
      bcCategories.Distributions.Enabled = true;
      bcCategories.Distributions.HorizontalPercents = true;
      bcCategories.Decimals = 0;
      bcCategories.HideData = true;

      if(CompareUtil.isInCompareMode(context) && !Export.isExportMode(context)) {
        diff.Title = TextAndParameterUtil.getLabelByKey(context, 'Total');
      } else {
        diff.Title = TextAndParameterUtil.getLabelByKey(context, 'FavMinUnfav');
      }

      if(parentHeader) {
        parentHeader.SubHeaders.Add(diff);
        parentHeader.SubHeaders.Add(bcCategories);
      } else {
        table.ColumnHeaders.Add(diff);
        table.ColumnHeaders.Add(bcCategories);
      }
      return [diff, bcCategories];
    }

    throw new Error('PageResults.addScore: Calculation of score for type "'+scoreType+' is not found."');
  }

  /*
*  add base column
*  @param {object} context: {state: state, report: report, log: log, table: table}
*  @param {Header} parentHeader - not mandatory
*  @param {boolean} withPercents - not mandatory
*  @param {object} recodingInfo - not mandatory, should be used in HeaderCategories instead of showing just Total
*/
  static function addResponsesColumn(context, parentHeader, withPercents, recodingInfo) {

    var table = context.table;

    // add Responses Column
    var responses: HeaderSegment = new HeaderSegment();
    var catForMask: HeaderCategories = new HeaderCategories();

    catForMask.HideHeader = true;
    TableUtil.maskOutNA(context, catForMask);

    catForMask.Mask.Type = MaskType.ShowCodes;
    catForMask.Mask.Codes = ''; // do not show any codes but Total


    responses.SubHeaders.Add(catForMask);
    responses.Label = TextAndParameterUtil.getLabelByKey(context, 'Base');
    responses.DataSourceNodeId = DataSourceUtil.getDsId(context);

    if(parentHeader) {
      parentHeader.SubHeaders.Add(responses);
    } else {
      table.ColumnHeaders.Add(responses);
    }
  }


  /*
*  add distribution bar chart
*  @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function addDistributionBarChart(context) {

    var table = context.table;
    var state = context.state;

    //add distribution barChart
    var bcCategories: HeaderCategories = new HeaderCategories();
    bcCategories.RecodingIdent = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'ReusableRecodingId');
    bcCategories.Totals = false;
    bcCategories.Distributions.Enabled = true;
    bcCategories.Distributions.HorizontalPercents = true;
    bcCategories.Decimals = 0;
    bcCategories.HideData = false;
    table.ColumnHeaders.Add(bcCategories);

    if(state.ReportExecutionMode !== ReportExecutionMode.ExcelExport) {

      var barChart: HeaderChartCombo = new HeaderChartCombo();
      var chartValues = [];
      var barChartColors = Config.barChartColors_Distribution;
      var i;

      bcCategories.HideData = true;

      for(i=0; i< barChartColors.length; i++) {
        var chartValue: ChartComboValue = new ChartComboValue();
        chartValue.Expression = 'cellv(col-'+(i+1)+', row)';
        chartValue.BaseColor = new ChartComboColorSet([barChartColors[i].color]);
        chartValue.Name = TextAndParameterUtil.getTextTranslationByKey(context, barChartColors[i].label);
        chartValue.CssClass = 'barchart__bar barchart__bar_type_distribution '+ barChartColors[i].type;
        chartValues.push(chartValue);
      }

      barChart.Values = chartValues;
      barChart.TypeOfChart = ChartComboType.Bar100;
      barChart.Title = TextAndParameterUtil.getLabelByKey(context, 'Distribution');
      table.ColumnHeaders.Add(barChart);
    }

  }


  /*
* Add set of benchmark related set of columns: Benchmarks, Benchmark comparison bar chart
* @param {object} context: {state: state, report: report, log: log, table: table}
*/

  static function tableStatements_AddBenchmarkColumns_Banner0 (context) {

    var log = context.log;

    if(!isBenchmarkAvailable(context)) {
      return;
    }

    var report = context.report;
    var state = context.state;
    var table = context.table;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);
    var bmColumn = 2; // 1st coulumn always exists - it's base
    var baseValues: Datapoint[] = report.TableUtils.GetColumnValues('Benchmarks',1);
    var suppressValue = Config.SuppressSettings.TableSuppressValue;
    var benchmarkTableLabels = report.TableUtils.GetColumnHeaderCategoryTitles('Benchmarks');
    var BenchmarkViewType = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BenchmarkViewType');

    // add benchmark data based on benchmark project
    if(DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BenchmarkProject')) {

      var benchmarkContent: HeaderContent = new HeaderContent();
      var benchmarkValues: Datapoint[] = report.TableUtils.GetColumnValues('Benchmarks',bmColumn);

      for(var i=0; i<benchmarkValues.length; i++) {

        var base: Datapoint = baseValues[i];
        var benchmark: Datapoint = benchmarkValues[i];

        if (base.Value >= suppressValue && !benchmark.IsEmpty) {
          benchmarkContent.SetCellValue(i, benchmark.Value);
        }
      }

      table.ColumnHeaders.Add(benchmarkContent);

      if(BenchmarkViewType === 'value') {
        benchmarkContent.HideData = false;
        benchmarkContent.Title = TextAndParameterUtil.getLabelByKey(context, 'BenchmarkColumn');
      }


      // add formula to calculate score vs. benchmark
      if(BenchmarkViewType === 'chart' && !Export.isExcelExportMode(context)) {

        benchmarkContent.HideData = true;

        var barChart_ScoreVsNorm: HeaderChartCombo = new HeaderChartCombo();
        var chartValue_ScoreVsNorm = [];
        var barChart_ScoreVsNormColors = Config.barChartColors_NormVsScore;

        barChart_ScoreVsNorm.TypeOfChart = ChartComboType.Bar;
        barChart_ScoreVsNorm.Thickness = '100%';
        barChart_ScoreVsNorm.Size = 200;
        barChart_ScoreVsNorm.HideHeader = true;

        var chartValue_Main: ChartComboValue = new ChartComboValue();
        chartValue_Main.Expression = 'cellv(col+1,row)'; // diff between score and norm value
        chartValue_Main.BaseColor = new ChartComboColorSet([barChart_ScoreVsNormColors[1].color]); // main color is red - negative
        chartValue_Main.Name = TextAndParameterUtil.getTextTranslationByKey(context, 'ScoreVsNormValue');
        chartValue_Main.CssClass = 'barchart__bar barchart__bar_type_score-vs-norm';

        var chartValue_Alternative: ChartComboColorAlternative = new ChartComboColorAlternative();
        chartValue_Alternative.Color = new ChartComboColorSet([barChart_ScoreVsNormColors[0].color]);
        chartValue_Alternative.Threshold = 0; // If greater than 0

        chartValue_Main.AltColors = [chartValue_Alternative];
        chartValue_ScoreVsNorm.push(chartValue_Main);

        barChart_ScoreVsNorm.Values = chartValue_ScoreVsNorm;
        barChart_ScoreVsNorm.Title = new Label(report.CurrentLanguage,TextAndParameterUtil.getTextTranslationByKey(context, 'ScoreVsNormValue'));

        table.ColumnHeaders.Add(barChart_ScoreVsNorm);

        var formula_ScoreVsNorm: HeaderFormula = new HeaderFormula();
        formula_ScoreVsNorm.Type = FormulaType.Expression;
        formula_ScoreVsNorm.Expression = 'if((cellv(1,row)-cellv(col-2,row) < 1 AND (cellv(1,row)-cellv(col-2,row) > -1)), 0, cellv(1,row)-cellv(col-2,row))'; // the 1st column in the table is score

        if(Export.isExcelExportMode(context)) {
          formula_ScoreVsNorm.Expression = 'if((cellv(1,row)-cellv(col-1,row) < 1 AND (cellv(1,row)-cellv(col-1,row) > -1)), 0, cellv(1,row)-cellv(col-1,row))'; // no bar chart header in excel
          formula_ScoreVsNorm.Title = TextAndParameterUtil.getLabelByKey(context, 'ScoreVsNormValue');
        }
        table.ColumnHeaders.Add(formula_ScoreVsNorm);
      }

      bmColumn+=1;
    }

  }


  /*
* Conditional Formatting for Statements table
* @param {object} context: {state: state, report: report, log: log, table: table}
*/

  static function tableStatements_ApplyConditionalFormatting(context) {

    var table = context.table;
    var log = context.log;

    if(!CompareUtil.isInCompareMode(context)) {
      // Score column is bold and has bigger font-size
      var area: Area = new Area();
      var condition: Condition = new Condition();
      condition.Expression = 'true';
      condition.Style = 'score-column cf-score-column';

      area.Name = 'Score';
      area.FromStart = true;
      area.Indexes = '1';
      area.RowFormatting = false;
      area.AddCondition(condition);

      table.ConditionalFormatting.AddArea(area);
    } else {
      CondFormatUtil.applyConditionalFormatting(context, 'set1');
    }
  }


  /*
* show distribution bar chart legend
* @param {object} context {state: state, report: report, log: log, text: text}
*/

  static function drawDistributionChartLegend(context) {

    var text = context.text;
    var barChartColors = Config.barChartColors_Distribution;
    var legend = '<ul class="table-bc-legend">';

    for (var i=0; i < barChartColors.length; i++) {
      legend += '<li class="table-bc-legend__item legend-item">'+
          '<div class="legend-item__color" style="background-color: '+barChartColors[i].color+';"></div>'+
          '<div class="legend-item__label">'+TextAndParameterUtil.getTextTranslationByKey(context, barChartColors[i].label)+'</div>'+
          '</li>';
    }

    legend += '</ul>';
    text.Output.Append(legend);

    return;
  }


  // ---------------------------------- COMPARE START ----------------------------------

  /**
   * add columns in Compare mode
   * @param {object} context: {state: state, report: report, log: log, table: table}
   */
  static function tableStatements_AddColumnsInCompareMode(context) {

    var log = context.log;
    var table = context.table;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);
    var filters = Filters.GetFilterListByType(context, 'global');
    var filterPrefix = 'p_ScriptedFilterPanelParameter';

    var totalHeader : HeaderSegment = new HeaderSegment();
    totalHeader.ShowTitle = true;
    totalHeader.Label = TextAndParameterUtil.getLabelByKey(context, 'Total');
    totalHeader.DataSourceNodeId = DataSourceUtil.getDsId(context);
    PageResults.addOneCompareHeader(context, totalHeader);

    for(var i = 0; i < filters.length; i++) { //loop by column questions
      var selectedCodes = ParamUtil.GetSelectedCodes(context, filterPrefix+(i+1));
      var qe: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, filters[i]);
      var hq: HeaderQuestion = new HeaderQuestion(qe);
      hq.ShowTotals = false;
      var qmask: MaskFlat = new MaskFlat(true);
      qmask.Codes.AddRange(selectedCodes);
      hq.AnswerMask = qmask;
      PageResults.addOneCompareHeader(context, hq);
    }

    //log.LogDebug(compareModeQs);
  }

  /**
   creates needed nesting for compare table
   */
  static function addOneCompareHeader(context, header) {

    var log = context.log;

    var breakByH = TableUtil.addBreakByNestedHeader(context, header); //INTERVIEW_END: add break by based on time period break by parameter

    var cat = PageResults.addDistributionBreakBy_ForCompare(context, breakByH); //CATEGORY: instead of filtering add break by distribution - temp
    if (breakByH) {
      breakByH.SubHeaders.Add(cat);
    } else {
      header.SubHeaders.Add(cat);
    }

    var hp = PageResults.addBase_ForCompare(context, true); //HP
    hp.HideData = true;
    var count = PageResults.addBase_ForCompare(context); //COUNT
    count.HideData = true;
    cat.SubHeaders.Add(hp);
    cat.SubHeaders.Add(count);

    var hpLabel = TextAndParameterUtil.getLabelByKey(context, 'ShareOfAnswers');
    var countLabel = TextAndParameterUtil.getLabelByKey(context, 'NumberOfAnswers');
    var scoreLabel = TextAndParameterUtil.getLabelByKey(context, 'Score');

    var selectedDistributionsCount = CompareUtil.getSelectedCompareCombinedDistributionCodes(context).length;

    var hpSupFormula = PageResults.createSuppressFormulaForHeader(context, 1, 2, selectedDistributionsCount, hpLabel, true);
    var countSupFormula = PageResults.createSuppressFormulaForHeader(context, 2, 2, selectedDistributionsCount, countLabel);

    var score = PageResults.addScore_ForCompare(context, scoreLabel); //SEGMENT -> CATEGORY + FORMULA

    if (breakByH) {
      breakByH.SubHeaders.Add(hpSupFormula);
      breakByH.SubHeaders.Add(countSupFormula);
      breakByH.SubHeaders.Add(score);
    } else {
      header.SubHeaders.Add(hpSupFormula);
      header.SubHeaders.Add(countSupFormula);
      header.SubHeaders.Add(score);
    }

    context.table.ColumnHeaders.Add(header);
  }

  /*
* create formula header with suppress in expression
* @param {object} context: {state: state, report: report, log: log, table: table}
* @param {int} countShift - shift to count column
* @param {int} headerShift - shift to current header column
* @param {Label} titleLabel - Label for current header
* @param {boolean} showPercent - true if percent sign should be shown
*/
  static function createSuppressFormulaForHeader(context, countShift, headerShift, selectedDistributionsCount, titleLabel, showPercent) {

    var log = context.log;

    var supFormula: HeaderFormula = new HeaderFormula();
    supFormula.Type = FormulaType.Expression;

    var countFormulaExpression = '';
    var headerFormulaExpression = '';

    for (var i = 0; i < selectedDistributionsCount; i++) {
      countFormulaExpression += 'cellv(col-' + (countShift + (2*i)) + ',row)';
      headerFormulaExpression += 'cellv(col-' + (headerShift + (2*i)) + ',row)' + (showPercent ? '/100' : '');
      if ((i + 1) != selectedDistributionsCount) {
        countFormulaExpression += ' + ';
        headerFormulaExpression += ' + ';
      }
    }

    var suppressValue = Config.SuppressSettings.TableSuppressValue;
    supFormula.Expression = 'if((' + countFormulaExpression + ') >= ' + suppressValue + ', ' + headerFormulaExpression + ', emptyv())';

    supFormula.Percent = showPercent;
    supFormula.ShowTitle = true;
    supFormula.Title = titleLabel;
    return supFormula;
  }

  /*
* add one column with nested header of Compare type
* @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function addDistributionBreakBy_ForCompare(context) {

    var log = context.log;

    var selectedDistributionCodesArray = CompareUtil.getSelectedCompareCombinedDistributionCodes(context);
    var selectedDistributionCodes = CompareUtil.isInCompareModeByType(context, CompareUtil.scoreCompareModeTypeName)
        ? CompareUtil.GetAllDistributionCodesFromTextLibrary(context).join(',')
        : selectedDistributionCodesArray.join(',');

    var recId = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'DistributionRecodingId');
    var catForMask: HeaderCategories = new HeaderCategories();

    catForMask.HideHeader = true;
    catForMask.RecodingIdent = recId;
    catForMask.RecodingShowOriginal = false;

    var mask: GenericCodeMask = new GenericCodeMask();
    mask.Codes = (selectedDistributionCodes && selectedDistributionCodes.length > 0) ? selectedDistributionCodes : '';
    mask.Type = MaskType.ShowCodes;
    catForMask.Mask = mask;
    catForMask.Totals = false;

    return catForMask;
  }

  /*
* add base to category column in Compare mode
* @param {object} context: {state: state, report: report, log: log, table: table}
* @param {boolean} withPercents - equals true if it's needed to show horizontal percents instead of count
*/
  static function addBase_ForCompare(context, withPercents) {

    var log = context.log;

    var baseHeader: HeaderBase = new HeaderBase();
    baseHeader.HideHeader = true;
    baseHeader.Distributions.Enabled = true;
    baseHeader.Distributions.Count = !withPercents;
    baseHeader.Distributions.HorizontalPercents = !!withPercents;
    baseHeader.Distributions.UseInnermostTotals = false;

    return baseHeader;
  }

  /*
* add score after category column in Compare mode
* @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function addScore_ForCompare(context, titleLabel) {

    var log = context.log;

    var catForScore: HeaderCategories = new HeaderCategories();
    catForScore.Totals = false;
    catForScore.HideHeader = true;
    catForScore.HideData = true;
    TableUtil.maskOutNA(context, catForScore);

    var distributionOptions = TextAndParameterUtil.getParameterValuesByKey(CompareUtil.distributionTextPropertyName);
    var selectedDistributionCodesArray: String[] = CompareUtil.getSelectedCompareCombinedDistributionCodes(context);
    selectedDistributionCodesArray = CompareUtil.isInCompareModeByType(context, CompareUtil.scoreCompareModeTypeName)
        ? CompareUtil.GetAllDistributionCodesFromTextLibrary(context)
        : selectedDistributionCodesArray;

    var selectedDistributionOptions = [];
    var codesCount = 0; // we assume that Distribution has all codes
    var selectedDistributionCodesArrayList: ArrayList = new ArrayList();
    selectedDistributionCodesArrayList.AddRange(selectedDistributionCodesArray);
    for (var i = 0; i < distributionOptions.length; i++) {
      if (selectedDistributionCodesArrayList.IndexOf(distributionOptions[i].Code) >= 0) {
        selectedDistributionOptions.push(distributionOptions[i]);
      }
      codesCount += distributionOptions[i].AnswerCodes.length;
    }

    var formulaExpression = '';
    for (var i = 0; i < selectedDistributionOptions.length; i++) {
      for (var j = 0; j < selectedDistributionOptions[i].AnswerCodes.length; j++) {
        formulaExpression += 'cellv(col-' + (codesCount-selectedDistributionOptions[i].AnswerCodes[j]+1) + ',row)*' + selectedDistributionOptions[i].AnswerScores[j];
        if ((j + 1) != selectedDistributionOptions[i].AnswerCodes.length) {
          formulaExpression += ' + ';
        }
      }
      if ((i + 1) != selectedDistributionOptions.length) {
        formulaExpression += ' + ';
      }
    }

    if (formulaExpression) {
      formulaExpression = 'if(cellv(col-1-' + codesCount + ',row)>0, (' + formulaExpression + ')/cellv(col-1-' + codesCount + ',row), emptyv())';

      var formulaHeader: HeaderFormula = new HeaderFormula();
      formulaHeader.Type = FormulaType.Expression;
      formulaHeader.Expression = formulaExpression;
      formulaHeader.ShowTitle = true;
      formulaHeader.Title = titleLabel;

      var score: HeaderSegment = new HeaderSegment(); //to unite categories and formula
      score.DataSourceNodeId = DataSourceUtil.getDsId(context);
      score.HideHeader = true;
      score.SubHeaders.Add(catForScore);
      score.SubHeaders.Add(formulaHeader);

      return score;
    }
  }

  // ---------------------------------- COMPARE END ----------------------------------


  // ---------------------------------- BENCHMARKS START ----------------------------------

  /*
* Assemble Benchmarks table
* @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function tableBenchmarks_Render(context) {

    var state = context.state;
    var table = context.table;
    var log = context.log;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);

    if(isBenchmarkAvailable(context)) {
      PageResults.tableStatements_AddRows(context);
      PageResults.tableBenchmarks_AddColumns_Banner0(context);

      table.Decimals = 0;
      table.RowNesting = TableRowNestingType.Nesting;
      table.RemoveEmptyHeaders.Rows = false;
    }
  }

  /*
* Populate benchmarks table
* @param {object} context: {state: state, report: report, log: log, table: table, user: user}
*/
  static function tableBenchmarks_AddColumns_Banner0(context) {

    var report = context.report;
    var state = context.state;
    var table = context.table;
    var log = context.log;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);

    // add Responses Column
    var excludedFiltersForN: HeaderSegment = new HeaderSegment();
    var responses: HeaderBase = new HeaderBase();

    excludedFiltersForN.DataSourceNodeId = DataSourceUtil.getDsId(context);
    excludedFiltersForN.SegmentType = HeaderSegmentType.Expression;
    excludedFiltersForN.Expression = Filters.getHierarchyFilter(context);
    excludedFiltersForN.HideHeader = true;
    excludedFiltersForN.SubHeaders.Add(responses);
    table.ColumnHeaders.Add(excludedFiltersForN);


    //add Benchmarks from benchmark project
    if(DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BenchmarkProject')) {

      var benchmarks: HeaderBenchmark = new HeaderBenchmark();
      benchmarks.BenchmarkProjectId = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BenchmarkProject');

      if(DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BenchmarkSet')) {// there's benchmark set

        var selectedBMSet = ParamUtil.GetSelectedCodes(context, 'p_BenchmarkSet'); // can be only one option
        benchmarks.BenchmarkSet = selectedBMSet[0];
      }
      table.ColumnHeaders.Add(benchmarks);
    }

  }


  /*
* Checks is Benchmark table was build sucessfully, i.e. if benchmark project is defined
*  @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function isBenchmarkAvailable(context) {

    var log = context.log;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);
    var benchmarkProject = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'BenchmarkProject');

    if(benchmarkProject) {
      return true;
    }
    return false;
  }


  /*
* Checks is Benchmark table was build sucessfully, i.e. if benchmark project is defined
*  @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function table_Benchmarks_hide(context) {
    return !isBenchmarkAvailable(context);
  }

}
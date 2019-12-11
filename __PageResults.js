class PageResults {


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


    if(!CompareUtil.isInCompareMode(context)) {
      tableStatements_AddColumns(context, bannerId);

      table.RemoveEmptyHeaders.Rows = true;
      table.RemoveEmptyHeaders.Columns = true;
      
    } else {
      
      suppressSettings.type = 'row'; //in compare mode we use different direction
      table.RemoveEmptyHeaders.Rows = true;
      table.RemoveEmptyHeaders.Columns = false;
      
      var totalHeader : HeaderSegment = new HeaderSegment();
      totalHeader.ShowTitle = true;
      totalHeader.Label = TextAndParameterUtil.getLabelByKey(context, 'Total');
      totalHeader.DataSourceNodeId = DataSourceUtil.getDsId(context);
      tableStatements_AddNestedCompareColumn(context, totalHeader);

      tableStatements_AddColumnsInCompareMode(context);
    }

    tableStatements_AddRows(context);
    SuppressUtil.setTableSuppress(table, suppressSettings);

    tableStatements_ApplyConditionalFormatting(context);

    table.Decimals = 0;
    table.RowNesting = TableRowNestingType.Nesting;
    table.Caching.Enabled = false;

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

    tableStatements_AddColumns_Banner0(context); // default set
    return;

  }


  /*
* add columns in Compare mode
* @param {object} context: {state: state, report: report, log: log, table: table}
*/
  static function tableStatements_AddColumnsInCompareMode(context) {
    var log = context.log;
    var table = context.table;

    var pageId = PageUtil.getCurrentPageIdInConfig(context);
    var compareModeQs = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'CompareModeColumnVariables');

    if(compareModeQs.length > 0) {
      for(var i = 0; i < compareModeQs.length; i++) {
        var qe : QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, compareModeQs[i]);
        var hq : HeaderQuestion = new HeaderQuestion(qe);
        hq.ShowTotals = false;

        tableStatements_AddNestedCompareColumn(context, hq);
      }
    } else {
      throw new Error('PageResults.tableStatements_AddColumnsInCompareMode: Questions for columns in Compare Mode are not found');
    }

    //log.LogDebug(compareModeQs);
  }


  /*
* add one column with nested header of Compare type
* @param {object} context: {state: state, report: report, log: log, table: table}
* @param {Header} header - parent header
*/
  static function tableStatements_AddNestedCompareColumn(context, header) {
    var log = context.log;
    var table = context.table;

    TableUtil.addBreakByNestedHeader(context, header);
    if (header.SubHeaders.Count > 0) {
      for (var i = 0; i < header.SubHeaders.Count; i++) {
        addScore(context, header.SubHeaders[i]);
        addResponsesColumn(context, header.SubHeaders[i]);
      }
    } else {
      addScore(context, header);
      addResponsesColumn(context, header);
    }

    table.ColumnHeaders.Add(header);
  }

  /*
* Add set of rows based on questions or categorizations (for pulse)
* @param {object} context: {state: state, report: report, log: log, table: table}
*/

  static function tableStatements_AddRows(context) {

    var log = context.log;
    var pageId = PageUtil.getCurrentPageIdInConfig(context);
    var resultStatements = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'ResultStatements');
    var dimensions = DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'Dimensions');

    if(resultStatements && resultStatements.length>0 && dimensions && dimensions.length>0) {
      throw new Error('PageResults.tableStatements_AddRows: One of Config properties for page "Results" ResultStatements and Dimensions should be null or [].');
    }

    if(resultStatements && resultStatements.length>0) {
      tableStatements_AddRows_Banner0(context);
      return;
    }

    if(dimensions && dimensions.length>0) {
      tableStatements_AddRows_Banner1(context);
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
    addScore(context);
    //add distribution barChart
    addDistributionBarChart(context);
    // add Responses Column
    addResponsesColumn(context);
    // add Benchmark related columns
    tableStatements_AddBenchmarkColumns_Banner0(context);
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

      if(CompareUtil.isInCompareMode(context) && !(state.ReportExecutionMode === ReportExecutionMode.PdfExport || state.ReportExecutionMode === ReportExecutionMode.ExcelExport)) {
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

      if(CompareUtil.isInCompareMode(context) && !(state.ReportExecutionMode === ReportExecutionMode.PdfExport || state.ReportExecutionMode === ReportExecutionMode.ExcelExport)) {
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

      if(CompareUtil.isInCompareMode(context) && !(state.ReportExecutionMode === ReportExecutionMode.PdfExport || state.ReportExecutionMode === ReportExecutionMode.ExcelExport)) {
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
*/
  static function addResponsesColumn(context, parentHeader) {

    var table = context.table;

    // add Responses Column
    var responses: HeaderSegment = new HeaderSegment();
    var catForNAMask: HeaderCategories = new HeaderCategories(); // a way to exclude NA from base calculation

    TableUtil.maskOutNA(context, catForNAMask); // exclude NA code
    catForNAMask.HideHeader = true;
    catForNAMask.Mask.Type = MaskType.ShowCodes;
    catForNAMask.Mask.Codes = ''; // do not show any codes but Total
    responses.SubHeaders.Add(catForNAMask);
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
      if(BenchmarkViewType === 'chart' && state.ReportExecutionMode !== ReportExecutionMode.ExcelExport) {

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

        if(state.ReportExecutionMode === ReportExecutionMode.ExcelExport) {
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

  //-----------------------------------------------------------------------------------------------

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
      tableStatements_AddRows(context);
      tableBenchmarks_AddColumns_Banner0(context);

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

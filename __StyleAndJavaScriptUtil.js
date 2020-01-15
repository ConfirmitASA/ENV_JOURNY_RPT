class StyleAndJavaScriptUtil {

  /*
  * Assemble all "backend dependant" css styles and js scripts
   * @param {object} context {state: state, report: report, log: log}
   * @returns {string} script and style string
   */

  static function assembleBackendDependantStylesAndJS (context) {

    var str = '';

    try {
      str += buildReportTemplateModule (context); //js
    } catch(e) {
      throw new Error('StyleAndJavaScriptUtil.buildReportTemplateModule: failed with error "'+e.Message+'"');
    }

    try {
      str += applyTheme(context); // css
    } catch(e) {
      throw new Error('StyleAndJavaScriptUtil.applyTheme: failed with error "'+e.Message+'"');
    }

    return str;
  }

  /**
   * Gather all styling settings that is used in js in one object
   */

  static function generateStyleModule() {

    var styleModule = {};

    styleModule.barChartColors_NormVsScore = Config.barChartColors_NormVsScore;
    styleModule.greyColor = Config.primaryGreyColor;

    return styleModule;
  }

  /**
   * Gather all translations in one object and return in JSON string format
   */
  static function generateTranslationsObject (context) {

    var log = context.log;
    var translations = {};

    translations['No data to display'] = TextAndParameterUtil.getTextTranslationByKey(context, 'NoDataMsg');
    translations['ResetSorting'] = TextAndParameterUtil.getTextTranslationByKey(context, 'ResetSorting');
    translations['UpToCard'] = TextAndParameterUtil.getTextTranslationByKey(context, 'UpToCard');
    translations['From'] = TextAndParameterUtil.getTextTranslationByKey(context, 'From');
    translations['To'] = TextAndParameterUtil.getTextTranslationByKey(context, 'To');
    translations['Apply'] = TextAndParameterUtil.getTextTranslationByKey(context, 'Apply');
    translations['Reset'] = TextAndParameterUtil.getTextTranslationByKey(context, 'Reset');
    translations['All'] = TextAndParameterUtil.getTextTranslationByKey(context, 'All');
    translations['Avg'] = TextAndParameterUtil.getTextTranslationByKey(context, 'Avg');
    translations['Sorting'] = TextAndParameterUtil.getTextTranslationByKey(context, 'Sorting');
    translations['NumberOfAnswers'] = TextAndParameterUtil.getTextTranslationByKey(context, 'NumberOfAnswers');
    translations['PleaseSelectQuestions'] = TextAndParameterUtil.getTextTranslationByKey(context, 'PleaseSelectQuestions');

    translations['pageTitlePostfix'] = TextAndParameterUtil.getTextTranslationByKey(context, '_for');

    return translations;

  }

  /*
   * all js variables and functions that
   * - are specific to the template
   * - are defined based on Config
   * - therefore are build with help of Reportal scripting
   * will be properties of ReportTemplate global variable
   * The function below will build that variable.
   * @param {object} context {state: state, report: report, log: log, pageContext: pageContext}
   * @returns {string} script string
   */

  static function buildReportTemplateModule (context) {

    var log = context.log;
    var state = context.state;
    var pageContext = context.pageContext;

    var globalVarScript = [];
    var properties = []; // array of strings like 'property: propertyValue'

    // the place to define ReportTemplate's properties
    // examples
    // pagesToHide: [\'page1\', \'page2\']
    // logo: \'some url\';


    /* NEW FOR REDESIGN */
    properties.push('isInCompareMode: '+JSON.stringify(CompareUtil.isInCompareMode(context)));

    properties.push('survey: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Survey')));
    properties.push('filters: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Filters')));
    properties.push('compare: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Compare')));
    properties.push('score: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Score')));
    properties.push('defaultPlaceholderTxt: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'BreakBy')));
    properties.push('tagPlaceholderTxt: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'TagQuestion')));

    properties.push('logoLink:'+JSON.stringify(Config.logo));

    properties.push('pagesToShow: '+JSON.stringify(PageUtil.getPageIdsToShow(context)));

    properties.push('pageHasViewSwitch: '+JSON.stringify(PageUtil.isViewSwitchAvailable(context)));

    properties.push('hideTimePeriodFilters: '+Filters.isTimePeriodFilterHidden(context));

    properties.push('noDataWarning: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'NoDataMsg')));

    properties.push('commentNumber: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'CommentNumber')));

    properties.push('TableChartColName_ScoreVsNormValue: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'ScoreVsNormValue')));

    properties.push('TableChartColName_Distribution: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Distribution')));

    properties.push('About: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'About')));

    properties.push('CollapseExpand: '+JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'CollapseExpand')));

    properties.push('Styling: '+JSON.stringify(generateStyleModule()));

    properties.push('translations:'+ JSON.stringify(generateTranslationsObject (context)));

    properties.push('numerationPrefix:'+ JSON.stringify(ParamUtil.numerationPrefix));

    if (pageContext.Items['CurrentPageId'] === 'Comments') {
      properties.push('tagColumnNumbers: '+JSON.stringify(PageComments.getTagColumnNumbers (context)));
      properties.push('nonTagColumnsCount: '+JSON.stringify(PageComments.getNonTagColumnsCount (context)));
    }

    if (pageContext.Items['CurrentPageId'] === 'KPI') {
      properties.push('gaugeData: '+JSON.stringify(PageKPI.getKPIResult(context)));
      properties.push('gaugeType: '+JSON.stringify(DataSourceUtil.getPagePropertyValueFromConfig(context, "Page_KPI", "KPIType")));
      properties.push('gaugeThreshold: '+JSON.stringify(DataSourceUtil.getPagePropertyValueFromConfig(context, "Page_KPI", "KPIThreshold")));
    }

    if (pageContext.Items['CurrentPageId'] === 'Trends') {
      properties.push('trendQuestions: ' + JSON.stringify(ParamUtil.GetSelectedOptions(context, 'p_TrendQs')));
    }

    if (pageContext.Items['CurrentPageId'] === 'Categorical_') {
      properties.push('pieData: '+JSON.stringify(PageCategorical.getPieCollection(context)));
      properties.push('pieColors: '+JSON.stringify(Config.pieColors));
      properties.push('scrollUpToCardText: ' + JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Page_Categorical_ScrollUpToCardText')));

      if (!state.Parameters.IsNull('p_Drilldown') && state.Parameters.GetString('p_Drilldown')) {
        properties.push('drilldownId: ' + JSON.stringify(state.Parameters.GetString('p_Drilldown')));
      }
    }

    if (pageContext.Items['CurrentPageId'] === 'CategoricalDrilldown') {
      properties.push('isProjectSelectorDisabled: '+true);
    }

    if (pageContext.Items['CurrentPageId'] === 'Wordclouds') {
      properties.push('wordcloudQuestionId: ' + JSON.stringify(ParamUtil.GetSelectedCodes(context, "p_WordcloudQs")));

      properties.push('wordcloudMainColor: ' + JSON.stringify(Config.wordcloudMainColor));
      properties.push('wordcloudSecondaryColor: ' + JSON.stringify(Config.wordcloudSecondaryColor));
    }

    properties.push('exportWindowFiles: {CSS_1page: ' + JSON.stringify(Config.exportWindowStylingFiles.page1CSS));
    properties.push('CSS_2page: ' + JSON.stringify(Config.exportWindowStylingFiles.page2CSS));
    properties.push('JS_1page: ' + JSON.stringify(Config.exportWindowStylingFiles.page1JS));
    properties.push('JS_2page: ' + JSON.stringify(Config.exportWindowStylingFiles.page2JS) + '}');

    var exportWindowOptions = getExportWindowOptions(context);

    properties.push('exportWindowOptionFlags: {pdf: ' + JSON.stringify(exportWindowOptions.flags.pdf));
    properties.push('excel: ' + JSON.stringify(exportWindowOptions.flags.excel));
    properties.push('excelScopeExt: ' + JSON.stringify(exportWindowOptions.flags.excelScopeExt));
    properties.push('ppt: ' + JSON.stringify(exportWindowOptions.flags.ppt)+'}');

    properties.push('exportWindowOptionIndexes: {pdf: ' + JSON.stringify(exportWindowOptions.indexes.pdf));
    properties.push('excel: ' + JSON.stringify(exportWindowOptions.indexes.excel));
    properties.push('excelScopeExt: ' + JSON.stringify(exportWindowOptions.indexes.excelScopeExt));
    properties.push('ppt: ' + JSON.stringify(exportWindowOptions.indexes.ppt)+'}');

    properties.push('executionMode: ' + JSON.stringify(state.ReportExecutionMode));

    properties.push('exportTranslations: {inQueueText: ' + JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'InQueue')));
    properties.push('completedText: ' + JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Completed')));
    properties.push('errorText: ' + JSON.stringify(TextAndParameterUtil.getTextTranslationByKey(context, 'Error'))+'}');


    globalVarScript.push('<script>');
    globalVarScript.push(';var ReportTemplateConfig = (function(){');
    globalVarScript.push('return {');
    globalVarScript.push(properties.join(', '));
    globalVarScript.push('}');
    globalVarScript.push('})();');
    globalVarScript.push('</script>');

    return globalVarScript.join('');
  }

  static function getExportWindowOptions(context) {
    var isEndUser = User.isEndUser(context);
    if (!isEndUser) {
      var exportWindowOptionFlags = {
        pdf: Config.pdfExportSettingsOptions.flags,
        excel: Config.excelExportSettingsOptions.flags,
        excelScopeExt: Config.excelScopeExtExportSettingsOptions.flags,
        ppt: Config.pptExportSettingsOptions.flags
      };
      var exportWindowOptionIndexes = {
        pdf: Config.pdfExportSettingsOptions.indexes,
        excel: Config.excelExportSettingsOptions.indexes,
        excelScopeExt: Config.excelScopeExtExportSettingsOptions.indexes,
        ppt: Config.pptExportSettingsOptions.indexes
      };
    } else {
      var exportWindowOptionFlags = {
        pdf: Config.pdfExportSettingsOptions.flags.slice(0, Config.encryptFileOptionIndex.pdf).concat(Config.pdfExportSettingsOptions.flags.slice(Config.encryptFileOptionIndex.pdf + 1)),
        excel: Config.excelExportSettingsOptions.flags.slice(0, Config.encryptFileOptionIndex.excel).concat(Config.excelExportSettingsOptions.flags.slice(Config.encryptFileOptionIndex.excel + 1)),
        excelScopeExt: Config.excelScopeExtExportSettingsOptions.flags.slice(0, Config.encryptFileOptionIndex.excelScopeExt).concat(Config.excelScopeExtExportSettingsOptions.flags.slice(Config.encryptFileOptionIndex.excelScopeExt + 1)),
        ppt: Config.pptExportSettingsOptions.flags.slice(0, Config.encryptFileOptionIndex.ppt).concat(Config.pptExportSettingsOptions.flags.slice(Config.encryptFileOptionIndex.ppt + 1))
      };
      var exportWindowOptionIndexes = {
        pdf: Config.pdfExportSettingsOptions.indexes.slice(0, Config.encryptFileOptionIndex.pdf).concat(Config.pdfExportSettingsOptions.indexes.slice(Config.encryptFileOptionIndex.pdf + 1)),
        excel: Config.excelExportSettingsOptions.indexes.slice(0, Config.encryptFileOptionIndex.excel).concat(Config.excelExportSettingsOptions.indexes.slice(Config.encryptFileOptionIndex.excel + 1)),
        excelScopeExt: Config.excelScopeExtExportSettingsOptions.indexes.slice(0, Config.encryptFileOptionIndex.excelScopeExt).concat(Config.excelScopeExtExportSettingsOptions.indexes.slice(Config.encryptFileOptionIndex.excelScopeExt + 1)),
        ppt: Config.pptExportSettingsOptions.indexes.slice(0, Config.encryptFileOptionIndex.ppt).concat(Config.pptExportSettingsOptions.indexes.slice(Config.encryptFileOptionIndex.ppt + 1))
      };

      for (var i = Config.encryptFileOptionIndex.pdf; i < exportWindowOptionIndexes.pdf.length; i++) {
        exportWindowOptionIndexes.pdf[i] = exportWindowOptionIndexes.pdf[i] - 1;
      }
      for (var i = Config.encryptFileOptionIndex.excel; i < exportWindowOptionIndexes.excel.length; i++) {
        exportWindowOptionIndexes.excel[i] = exportWindowOptionIndexes.excel[i] - 1;
      }
      for (var i = Config.encryptFileOptionIndex.excelScopeExt; i < exportWindowOptionIndexes.excelScopeExt.length; i++) {
        exportWindowOptionIndexes.excelScopeExt[i] = exportWindowOptionIndexes.excelScopeExt[i] - 1;
      }
      for (var i = Config.encryptFileOptionIndex.ppt; i < exportWindowOptionIndexes.ppt.length; i++) {
        exportWindowOptionIndexes.ppt[i] = exportWindowOptionIndexes.ppt[i] - 1;
      }
    }

    return {flags: exportWindowOptionFlags, indexes: exportWindowOptionIndexes};
  }

  static function applyTheme(context) {

    var state = context.state;
    var pageContext = context.pageContext;

    var greenColor = Config.primaryGreenColor;
    var redColor = Config.primaryRedColor;
    var greyColor = Config.primaryGreyColor;
    var kpiColor = Config.kpiColor;
    var kpiColor_dark = Config.kpiColor_dark;
    var logo = Config.logo;
    var headerBackground = Config.headerBackground;
    var primaryGreyColor = Config.primaryGreyColor;
    var pieColors = Config.pieColors;
    var barChartColors = Config.barChartColors_Distribution;
    var isThreeDotsMenuNeeded = Config.showThreeDotsCardMenu;
    var numberOfVerbatimComments = DataSourceUtil.getPagePropertyValueFromConfig(context, 'Page_KPI', 'NumberOfCommentsToShow');
    //var verbatimPositiveColor = Config.verbatimPositiveColor;
    //var verbatimNegativeColor = Config.verbatimNegativeColor;
    var css_string = '';

    css_string += ''

        //icon with two men in queue
        +'.icon--kpi{'
        +'background-image: url(data:image/svg+xml,%3Csvg%20fill%3D%22%23'+kpiColor.substring(1,kpiColor.length)+'%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M0%200h24v24H0z%22%20fill%3D%22none%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16%2011c1.66%200%202.99-1.34%202.99-3S17.66%205%2016%205c-1.66%200-3%201.34-3%203s1.34%203%203%203zm-8%200c1.66%200%202.99-1.34%202.99-3S9.66%205%208%205C6.34%205%205%206.34%205%208s1.34%203%203%203zm0%202c-2.33%200-7%201.17-7%203.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8%200c-.29%200-.62.02-.97.05%201.16.84%201.97%201.97%201.97%203.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z%22/%3E%0A%3C/svg%3E);'
        +'}'

        //nav menu item color
        +'.css-menu .yui3-menuitem:hover > a'
        +'{ color: '+kpiColor+'  !important;}'
        +'div.reportal-horizontal-menu>.yui3-menu .css-menu-topitem:hover {'
        +'border-bottom-color:'+kpiColor+'!important;}'

        //header background
        +'.global-header {'
        +'background-color: '+headerBackground+';'
        +'}'

        // calendar
        +'.yui-calcontainer>table .calnav,'
        +'.yui-calcontainer>table td.calcell.today>a{'
        +'    background: '+kpiColor+' !important;'
        +'    color: white!important;'
        +'}'
        +'.yui-calcontainer>table .calnavleft:before,'
        +'.yui-calcontainer>table .calnavright:before{'
        +'border-color: '+kpiColor+';}'
        +'.yui-calcontainer>table .calnav:hover {'
        +'background: '+kpiColor_dark+' !important;}'

        //unfavorable card
        +'div .material-card.unfavorable,'
        +'.material-card.unfavorable .Table td'
        +'{ background-color: '+redColor+' !important;}'

        //favorable card
        +'div .material-card.favorable,'
        +'div .material-card.favorable .Table td'
        +'{background-color: '+greenColor+';}'

        //hitlist navigation
        +'div .hitlist-nav-button:hover, '
        +'div .hitlist-nav-page:hover {'
        +'background-color: '+kpiColor+' !important;'
        +'}'

        //hitlist 'Read more'/'Read less' buttons for long comments
        +'.cell-btn_read-more {'
        +'color: '+redColor+' !important;'
        +'}'
        +'.cell-btn_read-less {'
        +'background-color: '+redColor+' !important;'
        +'}'

        //hierarchy component
        +'.dd-selected a .dd-item-text {'
        +'background-color: '+greyColor+' !important;'
        +'}'
        +'.dd-button-select {'
        +'background-color: '+greenColor+' !important;'
        +'}';


    //loading animation colors (three blinking dots)
    /*
    +'@keyframes pulse { '
	+'from { background-color:'+kpiColor+';}'
	+'to { background-color:'+kpiColor_dark+';}'
	+'}';
    */

    if(!isThreeDotsMenuNeeded) {
      css_string += '.material-card__title .kebab-menu { display: none; }';
    }
	  
    if (DataSourceUtil.ifSingleSurveyTypeUsed(context)) {      
      css_string += '.filter-pane__section_type_surveys { display: none; }';
    }

    // CSS to show only the latest n rows with comments
    // https://css-tricks.com/useful-nth-child-recipies/#article-header-id-2
    // Select the latest(=last) N and then "not" to select all the others and hide
    if(numberOfVerbatimComments) {
      css_string += '.card__verbatim-container tbody tr:not(:nth-last-child(-n+' + numberOfVerbatimComments + ')) { display: none; }';
    }

    if(CompareUtil.isInCompareMode(context)) {
      css_string += '.highcharts-point { fill: transparent; stroke: transparent; }';
      if (pageContext.Items['CurrentPageId'] === 'KPI') {
        css_string += '.card_type_verbatim { display: none; }';
      }

      var distributionCodes = ParamUtil.GetSelectedCodes(context, 'p_ScriptedFCompareParameter1');
      if (distributionCodes && distributionCodes.length > 0) {
        switch (distributionCodes[0]) {
          case '1':
            css_string += '.cf_set1_cellLevel1, .cf_set1_cellLevel2, .cf_set1_cellLevel3 { background-color: #a04e53 !important; color: white !important; }';
            break;
          case '2':
            css_string += '.cf_set1_cellLevel1, .cf_set1_cellLevel2, .cf_set1_cellLevel3 { background-color: #9d9d9d !important; color: white !important; }';
            break;
          case '3':
            css_string += '.cf_set1_cellLevel1, .cf_set1_cellLevel2, .cf_set1_cellLevel3 { background-color: #91ad80 !important; color: white !important; }';
            break;
        }
      }
    } else {
      css_string += '.highcharts-legend { display: none; }';
    }

    if (!CompareUtil.isCompareSectionNeeded(context)) {
      css_string += '.filter-pane__section_type_compare { display: none; }';
    }

    return '<style>'+css_string+'</style>';
  }

  static function reportStatisticsTile_Render(context, stat, icon) {

    var log = context.log;
    var str = '';
    var value;

    switch(stat) {
      case 'collectionPeriod': value = PageResponseRate.getCollectionPeriod(context); break;
      default: value = PageResponseRate.getResponseRateSummary(context)[stat]; break;
    }

    str += value;

    return str;
  }

}

class Filters {

  /**
   * not hierarchy, to exclude it from filters, not to add user to context - painful
   */
  static function excludeReportBaseFilter(context, filterList) {

    var pageContext = context.pageContext;
    var persFilterExpr = pageContext.Items['PersonalizedFilterExpression'];

    try { //for reports before that request and without property
      var reportBaseQids = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'ReportBaseQuestion');
    } catch(e) {
      return filterList;
    }

    //list empty or no expression for the user
    if(reportBaseQids.length === 0 || !persFilterExpr) {
      return filterList;
    }

    var newFilterList = [];
    // need to improve that, have no capacity right now
    for(var i=0; i<filterList.length; i++) {
      for(var j=0; j< reportBaseQids.length; j++) {
        if(filterList[i] !== reportBaseQids[j]) {
          newFilterList.push(filterList[i]);
        }
      }
    }

    return newFilterList;
  }
  /**
   * Get the list of all filters defined on the survey level based on survey data variables
   * @param {object} context object {state: state, report: report, log: log}
   * @returns {Array} - array of questions to filter survey data by (not page specific)
   */
  static function GetSurveyDataFilterList (context) {

    var log = context.log;
    var filterList = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'FiltersFromSurveyData');

    return excludeReportBaseFilter(context, filterList);
  }

  /**
   * Get the list of all filters defined on the survey level based on background variables
   * @param {object} context object {state: state, report: report, log: log}
   * @returns {Array} - array of questions to filter background data by (not page specific)
   */
  static function GetBackgroundDataFilterList (context) {

    var log = context.log;
    var filterList = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'Filters');

    return excludeReportBaseFilter(context, filterList);
  }

  /*
 * Get full filter list.
 * @param {object} context object {state: state, report: report, log: log}
 */
  static function GetFullFilterList (context) {

    var filterFromRespondentData = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'Filters');
    var filterFromSurveyData = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'FiltersFromSurveyData');
    var filterList = filterFromRespondentData.concat(filterFromSurveyData);

    return excludeReportBaseFilter(context, filterList);
  }

  /**
   * Get the list of all filters defined on the survey level (including background and survey data variables)
   * @param {object} context object {state: state, report: report, log: log}
   * @returns {Array} - array of questions to filter both background and survey data by (not page specific)
   */
  static function GetGlobalFilterList (context) {

    var log = context.log;
    var filterFromRespondentData = GetBackgroundDataFilterList (context);
    var filterFromSurveyData = GetSurveyDataFilterList (context);

    return filterFromRespondentData.concat(filterFromSurveyData);
  }

  /**
   * Get list of filters by type:
   * background - global background; survey - global survey data vars, pageSpecific - survey data from pageSpecific ds
   * @param {object} context object {state: state, report: report, log: log}
   * @param {string} filtersType - type of filter list
   * @returns {Array} filters - array of questions o filter by
   */
  static function GetFilterListByType (context, filtersType) {

    var log = context.log;

    //if filter type is not set it is global
    if(!filtersType) {
      filtersType = 'global';
    }

    if(filtersType === 'background') {
      return GetBackgroundDataFilterList(context);
    } else if (filtersType === 'survey') {
      return GetSurveyDataFilterList(context);
    } else if (filtersType === 'global'){
      return GetGlobalFilterList (context);
    }

    throw new Error('Filters.GetFilterListByType: filter type '+filtersType+' cannot be handled.')
  }

  /*
   * Reset filter parameters.
   * @param {object} context object {state: state, report: report, log: log}
   */
  static function ResetAllFilters (context) {

    var log = context.log;
    var filterNames = [];
    var i;

    var filterSurveyLevelParameters = GetGlobalFilterList(context);
    for (i=0; i<filterSurveyLevelParameters.length; i++) {
      filterNames.push('p_ScriptedFilterPanelParameter'+(i+1));
    }

    ParamUtil.ResetParameters(context, filterNames);

    return;
  }

  /**
   * Populate filter parameters.
   * @param {object} context object {state: state, report: report, log: log}
   * @param {number} paramNum number of filter
   */
  static function populateScriptedFilterByOrder(context, paramNum) {

    var log = context.log;
    var parameter = context.parameter;
    var filterList = GetFilterListByType (context);

    // no question for this parameter placeholder
    if (filterList.length < paramNum) {
      return;
    }

    var answers: Answer[] = QuestionUtil.getQuestionAnswers(context, filterList[paramNum-1]);

    for(var i=0; i<answers.length; i++) {

      var val = new ParameterValueResponse();
      val.StringValue = answers[i].Text;
      val.StringKeyValue = answers[i].Precode;
      parameter.Items.Add(val);
    }

    return;
  }

  /**
   * Hide filter placeholder if there's no filter question.
   * @param {object} context object {state: state, report: report, pageContext: pageContext, log: log}
   * @param {string} paramNum number of scripted filter
   * @returns {boolean} indicates if filter exists
   */
  static function hideScriptedFilterByOrder(context, paramNum) {

    var log = context.log;
    var numberOfBackgroundDataFilters = GetBackgroundDataFilterList(context).length;
    var filterList = GetFilterListByType(context);
    var CurrentPageId = PageUtil.getCurrentPageIdInConfig(context);

    // paramNum should be less than number of filter components on all pages
    // paramNum should be less than number of filters based on BG vars on Response Rate page
    if(paramNum > filterList.length || (CurrentPageId === 'Page_Response_Rate' && paramNum >numberOfBackgroundDataFilters)) {
      return true;    // hide
    }

    return false; // don't hide
  }

  /**
   * Get scripted filter title.
   * @param {object} context object {state: state, report: report, log: log}
   * @param {string} paramNum number of scripted filter
   * @returns {string} question title
   */
  static function getScriptedFilterNameByOrder(context, paramNum) {

    var log = context.log;
    var filterList = GetFilterListByType (context);

    if(filterList.length >= paramNum) {
      return QuestionUtil.getQuestionTitle(context, filterList[paramNum-1]);
    }

    return '';
  }

  /*
 * @function GeneratePanelFilterExpression
 * @description function to generate filter expression for the 'FilterPanel' filter. Filter parameters can be both single and multi selects
 * @param {Object} context
 * @return {String} filter script expression
 */

  static function GeneratePanelFilterExpression (context, filtersType) {

    var state = context.state;
    var log = context.log;

    var paramName = 'p_ScriptedFilterPanelParameter';
    var bgFilters = GetFilterListByType(context, 'background');
    var filters = (filtersType==='background') ? bgFilters : GetFilterListByType(context, filtersType);
    var startNum = (filtersType==='background') ? 0 : bgFilters.length;
    var filterExpr = [];
    var pageId = PageUtil.getCurrentPageIdInConfig(context);

    //because Results page in Compare mode have columns that should be filtered now (JOU-112)
    if (pageId === 'Page_Results' && CompareUtil.isInCompareCombinedDistributionMode(context)) {
      return '';
    }

    for (var i=0; i<filters.length; i++) {
      var paramId = paramName+(i+startNum+1);

      if(!state.Parameters.IsNull(paramId)) {

        // support for multi select. If you need multi-selectors, no code changes are needed, change only parameter setting + ? list css class
        var responses = ParamUtil.GetSelectedCodes(context, paramId);
        var individualFilterExpr = [];
        for (var j=0; j<responses.length; j++) {
          individualFilterExpr.push('IN('+DataSourceUtil.getDsId(context)+':'+filters[i]+', "'+responses[j]+'")');
        }
        filterExpr.push('('+individualFilterExpr.join(' OR ')+')');
      }
    }

    return filterExpr.join(' AND ');
  }

  /*
 * @function GetFilterValues
 * @description function to generate filter expression for the 'FilterPanel' filter. Filter parameters can be both single and multi selects
 * @param {Object} context
 * @return {Array} Array of objects {Label: label, selectedOptions: [{Label: label, Code: code}]}
 */

  static function GetFiltersValues (context, filtersType) {

    var log = context.log;

    var filterValues = [];
    var filters = GetFilterListByType (context, filtersType);
    var filterPrefix = 'p_ScriptedFilterPanelParameter';

    for (var i=0; i<filters.length; i++) {
      // support for multi select. If you need multi-selectors, no code changes are needed, change only parameter setting + ? list css class
      var selectedOptions = ParamUtil.GetSelectedOptions(context, filterPrefix+(i+1));
      var filterName = getScriptedFilterNameByOrder(context, i+1);

      if(selectedOptions.length>0) {
        filterValues.push({Label: filterName, selectedOptions: selectedOptions, qId: filters[i]});
      }
    }

    return filterValues;
  }

  /*
  * @function getFilterExpressionByAnswerRange
  * @description function to generate a script expression to filter by options of single question
  * @param {Object} context
  * @param {String} qId - question id
  * @param {Array} answerCodes - the array of answer codes to include
  * @return {String} filter script expression
  */
  static function getFilterExpressionByAnswerRange(context, qId, answerCodes) {

    var state = context.state;
    var report = context.report;
    var log = context.log;

    if(!answerCodes instanceof Array) {
      throw new Error('Filters.getFilterExpressionByAnswerRange: answerCodes is not an array; filter for '+qId);
    }

    qId = QuestionUtil.getQuestionIdWithUnderscoreInsteadOfDot(qId);

    if (answerCodes.length) {
      return 'IN(' + qId + ', "'+answerCodes.join('","')+'")';
    }
    return '';
  }

  /*
  * @description function indicationg if time period filter set is needed or not
  * @param {Object} context
  * @return {Boolean} true or false
  */
  static function isTimePeriodFilterHidden(context) {

    return DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'IsTimePeriodFilterHidden')
  }

  /*
  * @description function to generate a script expression to filter by selected time period
  * @param {Object} context
  * @param {String} qId - date question id
  * @return {String} filter script expression
  */
  static function getTimePeriodFilter(context, qId) {

    var log = context.log;

    if(isTimePeriodFilterHidden(context)) { // date period filter is hidden in pulse programs
      return '';
    }

    var timePeriod = DateUtil.defineDateRangeBasedOnFilters(context);
    var expression = [];

    // example: interview_start >= TODATE("2019-03-31")
    if(timePeriod.hasOwnProperty('startDateString') && timePeriod.startDateString) {
      expression.push(qId+'>=TODATE("'+timePeriod.startDateString+'")');
    }

    if(timePeriod.hasOwnProperty('endDate') && timePeriod.endDateString) {
      expression.push(qId+'<=TODATE("'+timePeriod.endDateString+'")');
    }

    return expression.join(' AND ');
  }


  /*
	* not empty comments filter
	* @param {context}
	* @param {Array} question list
	* @return {string} filter expression
    */
  static function notEmptyCommentsFilter(context, questions) {

    var expressions = [];

    for (var i=0; i<questions.length; i++) {

      var qid = QuestionUtil.getQuestionIdWithUnderscoreInsteadOfDot(questions[i]);
      expressions.push('NOT ISNULL(' + qid + ') AND '+ qid + ' != "" AND ' + qid + ' != " "');
    }
    return expressions.join(' OR ');

  }

  /*
	* not empty comments filter
	* @param {context}
	* @param {string} KPIGroupName: KPIPositiveAnswerCodes, KPINegativeAnswerCodes (as in Config)
	* @return {string} filter expression
    */

  static function filterByKPIGroup(context, KPIGroupName) {

    var kpiQids = ParamUtil.GetSelectedCodes(context, 'p_QsToFilterBy');
    var kpiQidsConfig = DataSourceUtil.getPagePropertyValueFromConfig (context, 'Page_KPI', 'KPI');
    var qId;


    if (kpiQidsConfig.length == 1) {
      qId = QuestionUtil.getQuestionIdWithUnderscoreInsteadOfDot(kpiQidsConfig[0]);
    } else {
      qId = QuestionUtil.getQuestionIdWithUnderscoreInsteadOfDot(kpiQids[0]);
    }
    var answerCodes = DataSourceUtil.getPagePropertyValueFromConfig (context, 'Page_KPI', KPIGroupName);
    return getFilterExpressionByAnswerRange(context, qId, answerCodes);
  }

  /*
  * filter by particular project in pulse program
  * @param {context} {state: state, report: report}
  * @param {string}
  * @return {string} filter expression
  */

  static function projectSelectorInPulseProgram(context) {

    var project : Project = DataSourceUtil.getProject(context);

    if(project.GetQuestion('pid') != null) {
      return 'IN(pid, PValStr("p_projectSelector"))';
    }

    return '';

  }

  /**
   * benchmark table may have references to upper hierarchy levels so they are excluded from the table,
   * but for base clac we still need them
   * @param {context} {state: state, report: report}
   * @param {string} hierLevel
   * @param {string} waveId
   * @return {string} filter expression
   */

  static function getHierarchyFilter(context, hierLevel) {

    var log = context.log;

    var excludedFilters = [];
    var hierFilter = hierLevel ? HierarchyUtil.getHierarchyFilterExpressionForNode (context, hierLevel) : HierarchyUtil.getHierarchyFilterExpressionForCurrentRB (context); // '' if hierarchy is not defined

    if(hierFilter) {
      excludedFilters.push(hierFilter);
    }


    return excludedFilters.join(' AND ');
  }


  /**
   *
   */
  static function persFilterExpresion (context) {

    var pageContext = context.pageContext;
    var persFilterExpr = pageContext.Items['PersonalizedFilterExpression'];

    if(persFilterExpr && persFilterExpr.length>0) {
      return persFilterExpr;
    }

    return '';
  }

}
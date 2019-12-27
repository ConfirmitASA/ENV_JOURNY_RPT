class FilterSummary {

  /*
  * Get string "parameter label: parameter value" instead of drop downs for PDF export.
  * @param {object} context object {state: state, report: report, log: log}
  * @param {paramName} parameter name
  * @param {filterText} key word for parameter label
  */

  static function filterSummaryText_Render (context, paramName, filterText) {

    var text = context.text;
    var report = context.report;
    var log = context.log;
    var filterName = TextAndParameterUtil.getTextTranslationByKey(context, filterText);
    var filterValues = ParamUtil.GetSelectedOptions(context, paramName);

    if(filterValues.length>0) { // do not print anything if parameter is empty

      var filterLabels = [];

      for(var i=0; i<filterValues.length; i++) {
        filterLabels.push(filterValues[i].Label);
      }

      text.Output.Append(filterName+" "+filterLabels.join(', ')+"<br>"+System.Environment.NewLine);
    }
  }


  /*
  * Get string "parameter label: parameter value" instead of drop downs for PDF export.
  * @param {object} context object {text: text, state: state, report: report, log: log, user: user, pageContext: pageContext}
  */
  static function globalReportFilterSummaryText_Render (context) {

    var log = context.log;
    var state = context.state;
    var user = context.user;
    var pageContext = context.pageContext;
    var text = context.text;
    var str = '';

    if(pageContext.Items['CurrentPageId'] === DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'DefaultPage') || state.ReportExecutionMode === ReportExecutionMode.ExcelExport) {

      // title
      str += TextAndParameterUtil.getTextTranslationByKey(context, 'FilterSummaryTitle');
      str += "<br>"+System.Environment.NewLine;

      // data source
      str += Export.displayDataSourceInfo(context);
      str += System.Environment.NewLine;

      //hierarchy
      if (user.PersonalizedReportBase) {
        str += '<div>'+TextAndParameterUtil.getTextTranslationByKey(context, 'ReportBase')+' '+user.PersonalizedReportBaseText+'</div>';
        str += System.Environment.NewLine;
      }

      //selected date period
      var selectedTimePeriod = ParamUtil.GetSelectedCodes(context, 'p_TimePeriod')[0];
      if(DataSourceUtil.isProjectSelectorNeeded(context) && selectedTimePeriod != 'ALL') { // no date filter in pulse programs and  when the time period filter is not applied
        var datePeriod = DateUtil.defineDateRangeBasedOnFilters(context);
        var start: DateTime = datePeriod.startDate;
        var end: DateTime = datePeriod.endDate;

        str += '<div>'+TextAndParameterUtil.getTextTranslationByKey(context, 'TimePeriod')+' '+start.ToShortDateString()+' - '+end.ToShortDateString()+'</div>';
        str += System.Environment.NewLine;
      }

      //filter panel filters
      var filterOptions = Filters.GetFiltersValues(context, 'global');

      if(filterOptions) {
        for(var i=0; i<filterOptions.length; i++) {

          var options = [];
          for(var j=0; j<filterOptions[i].selectedOptions.length; j++) {
            var option = filterOptions[i].selectedOptions[j];
            options.push(option.Label);
          }
          str += '<div>'+filterOptions[i].Label+': '+options.join(', ')+'</div>';
          str += System.Environment.NewLine;
        }
      }

      //filter panel break by and filter parameters from Compare section
      var compareOptions = CompareUtil.GetAllCompareParametersValues(context;

      if(compareOptions) {
        for(var i=0; i<compareOptions.length; i++) {

          var options = [];
          for(var j=0; j<compareOptions[i].selectedOptions.length; j++) {
            var option = compareOptions[i].selectedOptions[j];
            options.push(option.Label);
          }
          str += '<div>'+compareOptions[i].Label+': '+options.join(', ')+'</div>';
          str += System.Environment.NewLine;
        }
      }

      str = '<div class="layout layout_vertical"> <article class="card layout__card">'+str+'</article></div>'
      text.Output.Append(str);
    }

  }

}
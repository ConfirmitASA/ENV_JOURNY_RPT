class PageWordclouds {
 
     /**
     * @memberof PageWordclouds
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context){       
        return false;
    }
  
     /**
     * @memberof PageWordclouds
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){   
    }
  
  	/**
     * @memberof PageWordclouds
     * @function wordcloudHitlist_Hide
     * @description function to hide the hitlist
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
  static function wordcloudHitlist_Hide(context){     
    var state = context.state;
    
    // hitlist is excluded from Excel exports 
    if (state.ReportExecutionMode == ReportExecutionMode.ExcelExport)
      return true;
    
    return false;
  }
  
    /**
     * @memberof PageWordclouds
     * @function wordcloudHitlist_Render
     * @description function to render the hitlist
     * @param {Object} context - {component: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function wordcloudHitlist_Render(context){
      
      var report = context.report;
      var hitlist = context.hitlist;

      var pageId = PageUtil.getCurrentPageIdInConfig(context);
      var qId = ParamUtil.GetSelectedCodes(context, "p_WordcloudQs");
      //var dataSourceId = DataSourceUtil.getDsId(context);
      
      var hitlistColumn: HitListColumn = new HitListColumn(); 
      hitlistColumn.QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, qId);
      hitlist.Columns.Add(hitlistColumn);
      
    }  
  
  /**
     * @memberof PageWordclouds
     * @function wordcloudTable_Hide
     * @description function to hide the table
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function wordcloudTable_Hide(context){
      return false;
    }
  
    /**
     * @memberof PageWordclouds
     * @function wordcloudTable_Render
     * @description function to render the table
     * @param {Object} context - {component: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function wordcloudTable_Render(context){
      
      var table = context.table;
      var report = context.report;
      
      var pageId = PageUtil.getCurrentPageIdInConfig(context);
      var qId = ParamUtil.GetSelectedCodes(context, "p_WordcloudQs");
          
      table.Caching.Enabled = true;
            
      var question_word: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, 'word.' + qId);
      var questionHeader_word : HeaderQuestion = new HeaderQuestion(question_word);
      questionHeader_word.ShowTotals = false;
      questionHeader_word.Sorting.Enabled = true;
      questionHeader_word.Sorting.Direction = TableSortDirection.Descending;
      questionHeader_word.Sorting.TopN = 100;
      questionHeader_word.Sorting.SortByType = TableSortByType.Position;
      questionHeader_word.Sorting.Position = 1;
          
      var question_frequency: QuestionnaireElement = QuestionUtil.getQuestionnaireElement(context, 'frequency.' + qId);
      var questionHeader_frequency : HeaderQuestion = new HeaderQuestion(question_frequency);
      questionHeader_frequency.IsCollapsed = true;
      questionHeader_frequency.DefaultStatistic = StatisticsType.Sum;
      questionHeader_frequency.Preaggregation = StatisticsType.Sum;
      questionHeader_frequency.Decimals = 0;
      questionHeader_frequency.HideHeader = true;
      
      // add header segment to change title for Excel export
      var hs: HeaderSegment = new HeaderSegment(TextAndParameterUtil.getLabelByKey(context, 'NumberOfTimesMentioned'), '');
      hs.DataSourceNodeId = DataSourceUtil.getDsId (context);
      hs.SubHeaders.Add(questionHeader_frequency);
      
      table.RowHeaders.Add(questionHeader_word);
      table.ColumnHeaders.Insert(0, hs); //table.ColumnHeaders.Insert(0, questionHeader_frequency);
      table.Use1000Separator = false;
      
    }  
}
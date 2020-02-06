class PageTrend {

    /**
     * @memberof PageTrend
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context){
        // TO DO: hide page depending on suppress data settings ???
        return false;
    }

    /**
     * @memberof PageTrend
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */

    static function Render(context){

    }

    /**
     * @memberof PageTrend
     * @function htlComments_Hide
     * @description function to hide the hitlist
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tableTrend_Hide(context){

        return SuppressUtil.isGloballyHidden(context);

    }

    /**
     * @memberof PageTrend
     * @function htlComments_Render
     * @description function to render the trend table
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tableTrend_Render(context){

        var report = context.report;
        var state = context.state;
        var table = context.table;
        var suppressSettings = context.suppressSettings;
        var log = context.log;

        // add rows (1 or more KPI questions)
        var Qs = ParamUtil.GetSelectedCodes (context, "p_TrendQs");

        for (var i=0; i<Qs.length; i++) {
            table.RowHeaders.Add(TableUtil.getTrendQuestionHeader(context, Qs[i]));
        }

        // add column - trending by Date variable
        var dateQId = DataSourceUtil.getSurveyPropertyValueFromConfig (context, 'DateQuestion');
        TableUtil.addTrending(context, dateQId);

        // global table settings
        table.Decimals = Config.Decimal;
        table.Caching.Enabled = false;
        SuppressUtil.setTableSuppress(table, suppressSettings);

        if (CompareUtil.isInCompareModeByType(context, CompareUtil.standardCompareModeTypeName)) {
            CondFormatUtil.applyConditionalFormatting(context, 'set1');
        }

        table.RemoveEmptyHeaders.Columns = false;
    }



    /**
     * @memberof PageKPI
     * @function chartTrend_Hide
     * @description function to hide the trend chart
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function chartTrend_Hide(context){

        var state = context.state;

        // charts are excluded from Excel exports
        if (Export.isExcelExportMode(context))
            return true;

        return SuppressUtil.isGloballyHidden(context);

    }

}
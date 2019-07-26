class PageUtil {

    /*
     * Collection of initialse page scripts.
     * Put here the code that needs to run when page loads.
     * @param {object} context object {state: state, report: report, page: page, user:user, pageContext: pageContext, log: log}
     */

    static function Initialise(context) {

        var state = context.state;
        var page = context.page;
        var log = context.log;
        var pageContext = context.pageContext;

        pageContext.Items.Add('CurrentPageId', page.CurrentPageId);

        ParamUtil.Initialise(context); // initialise parameters

        // if in current DS a page shouldn't be visible, than redirect to default page
        // very actual when 1st report page should not be visible
        if(!isPageVisible(context)) {
            page.NextPageId = DataSourceUtil.getSurveyPropertyValueFromConfig (context, 'DefaultPage');
            return;
        }

        // reset not bg var based filters on response rate page
        if(pageContext.Items['CurrentPageId'] === 'Response_Rate') {

            var filterFromRespondentData = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'Filters');
            var filterFromSurveyData = DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'FiltersFromSurveyData');

            for(var i=0; i<filterFromSurveyData.length; i++) {
                state.Parameters['p_ScriptedFilterPanelParameter'+(filterFromRespondentData.length+i+1)] = null;
            }
        }

        if(!HierarchyUtil.Hide(context) && HierarchyUtil.isDataTableEmpty(context)) { // hierarchy needed and not cached yet
            // populate cached hierarchy if needed
            // for now it's only needed for results page hierarchy benchamrks
            HierarchyUtil.setDataTable(context);
        }
    }

    /*
     * Array of pages that should later be hidden (as there's nothing to show) with js by name.
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Array} pagesToHide array of page Names that should be hidden
     */

    static function getPageIdsToShow(context) {

        var log = context.log;
        var pagesToShow = {};

        var surveyProperties = DataSourceUtil.getSurveyConfig(context);

        for(var property in surveyProperties) {
            if(property.indexOf('Page_')===0) { //page config
                var pageId = property.slice('Page_'.length).toLowerCase();
                var isHidden = false;
                isHidden = DataSourceUtil.getPagePropertyValueFromConfig(context, property, 'isHidden');
                if(!isHidden) {
                    pagesToShow[pageId] = TextAndParameterUtil.getTextTranslationByKey(context, property);
                }
            }
        }

        return pagesToShow;
    }

    /*
     * Indicates if page is visible for the selected DS or not.
     * @param {object} context object {state: state, report: report, log: log}
     * @returns {Boolean}
     */

    static function isPageVisible(context) {
        var state = context.state;
        var log = context.log;

        var pageContext = context.pageContext;
        var pageId = pageContext.Items['CurrentPageId'];

        if(!!pageId) {
            var isHiddenInWeb = !DataSourceUtil.getPagePropertyValueFromConfig(context, pageId, 'isHidden');
            return isHiddenInWeb;
        } else {

            return true; // return true by default (i.e. show page)
        }

    }

    //TO DO: temporarily solution. should bó a check for each component, not for a whole page
    /*
     * Check if a page should have a toggle to switch between Chart and Table View
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {Boolean}
     */

    static function isViewSwitchAvailable (context) {
        var log = context.log;
        var pageContext = context.pageContext;
        if (pageContext.Items['CurrentPageId'] === 'Trend')
            return true;
        return false;
    }

    /*
     * Get property name for page config
     * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
     * @returns {string} 'Page_'+pageId
     */
    static function getCurrentPageIdInConfig (context) {

        var pageContext = context.pageContext;
        var log = context.log;
        var pageId = pageContext.Items['CurrentPageId'];

        return 'Page_'+pageId;
    }


    /*
    * Get the page description of the current page from the Text Library
    * @param {object} context object {state: state, report: report, log: log, pageContext: pageContext}
    * @returns {string} page description
    */

    static function getPageDescription(context) {

        var log = context.log;
        var pageContext = context.pageContext;

        var pageId = getCurrentPageIdInConfig (context);
        return TextAndParameterUtil.getTextTranslationByKey(context, pageId+'_description');

    }

}
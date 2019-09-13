class Export {

    static function isExportMode (context) {

        var state = context.state;
        return (state.ReportExecutionMode === ReportExecutionMode.PdfExport || state.ReportExecutionMode === ReportExecutionMode.ExcelExport) ? true : false;
    }

    static function isExcelExportMode (context) {

        var state = context.state;
        return (state.ReportExecutionMode === ReportExecutionMode.ExcelExport) ? true : false;
    }

    static function isPDFExportMode (context) {

        var state = context.state;
        return (state.ReportExecutionMode === ReportExecutionMode.PdfExport) ? true : false;
    }

    /*
     * diaplay Program/Survey infor pdf export (dropdowns are not rendered in pdf exports)
     * @param {object} {state: state, report: report, text: text, log: log}
     * @return {paramName} str to append to text component
     */

    static function displayDataSourceInfo(context) {

        var state = context.state;
        var log = context.log;
        var str = '';


        var selectedProject: Project = DataSourceUtil.getProject(context);
        str+= selectedProject.ProjectTitle+' '+TextAndParameterUtil.getTextTranslationByKey(context, 'Survey');

        if(!state.Parameters.IsNull('p_projectSelector')) {
            var selectedSurvey: ParameterValueResponse = state.Parameters['p_projectSelector'];
            str+= 'Survey Name: '+selectedSurvey.DisplayValue+' ';
            str = '<div class="data-source-info">'+str+'</div>';
        }

        return str;
    }

}
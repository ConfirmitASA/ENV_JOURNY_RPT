class CondFormatUtil {

    /**
     * set conditional formatting for table.
     * @param {object} context object {confirmit: confirmit, user: user, state: state, report: report, log: log, table: table, pageContext: pageContext}
     * @param {string} Conditional Formatting set id
     */
    static function applyConditionalFormatting(context, colorSet) {

        if (!CompareUtil.isInCompareCombinedDistributionMode(context)) return;

        var formatter : ConditionalFormatting = context.table.ConditionalFormatting;
        var area : Area = new Area();
        area.Name = 'Area 1';
        area.ApplyTo(Area.Rows, Area.Top, "1-9999");

        var colors = Config.ConditionalFormatting[colorSet];
        for (var i = 0; i < colors.length; i++) {
            var c1 : Condition = new Condition();
            c1.Style = colorSet+'_'+colors[i].style;
            if (i==0) c1.Expression = (colors[i].conditionBody ? colors[i].conditionBody : 'cellv(col,row)') + '==emptyv()';
            else if (colors[i].condition) c1.Expression = (colors[i].conditionBody ? colors[i].conditionBody : 'cellv(col,row)') + colors[i].condition;
            else c1.Expression = 'true';
            context.log.LogDebug(c1.Expression);
            area.AddCondition(c1);
        }

        formatter.AddArea(area);
        context.table.ConditionalFormatting = formatter;
    }

}
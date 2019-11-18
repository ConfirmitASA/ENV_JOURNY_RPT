class TextAndParameterUtil {

    /*
     * Get set of labels and codes for parameter from ParameterValuesLibrary
     * @param {string} keyName
     * @returns {object} setOfLabelsAndCodes value
     */

    static function getParameterValuesByKey(keyName) {

        var setOfLabelsAndCodes = TextAndParameterLibrary.ParameterValuesLibrary[keyName];

        if(setOfLabelsAndCodes == null) {
            throw new Error('TextAndParameterTextLibrary.getParameterValuesByKey: Translation/Code object is not found for property "'+keyName+'"');
        }

        return setOfLabelsAndCodes;
    }


    /*
     * Get all properties for the selected parameter value
     * @param {string} parameterName - the name of the report parameter
     * @param {string} parameterValue - the selected answer code of the report parameter
     * @returns {object} - object containing Code, Label and other properties, e.g. TimeUnit
     */
    static function getInfoByParameterValue(parameterName, parameterValue) {

        var configParamName = ParamUtil.reportParameterValuesMap[parameterName];
        var domainParamValues = getParameterValuesByKey(configParamName);

        for (var i=0; i< domainParamValues.length; i++) {
            if (domainParamValues[i].Code === parameterValue) {
                return domainParamValues[i];
            }
        }
    }


    /*
     * Get translation for text by key
     * @param {object} context {state: state, report: report, log: log}
     * @param {string} keyName
     * @returns {object} property value
     */

    static function getTextTranslationByKey(context, keyName) {

        var report = context.report;
        var log = context.log;
        var currentLanguage = report.CurrentLanguage;

        var keys = keyName.split('.');  // '.' can be used for complex keys (deep objects with translations, e.g. Page_Response_Rate_Trend)
        var primaryKey = keys[0];
        var translation = TextAndParameterLibrary.TextLibrary[primaryKey];

        if(translation != null) {

            if (keys.length > 1 ) {
                var subKey = keys[1];
                translation = translation[subKey];
            }

            translation = translation[currentLanguage];
        }

        if(translation == null) {

            throw new Error('TextAndParameterTextLibrary.getParameterValuesByKey: No translation for '+keyName+' for language "'+currentLanguage+'" was found');
        }

        return translation;
    }

    /*
     * Get Multilingual label by key
     * @param {object} context {state: stae, report: report, log: log}
     * @param {string} keyName
     * @returns {Label} - Multilingual label
     */
    static function getLabelByKey(context, keyName) {

        var report = context.report;
        var log = context.log;

        var translation = getTextTranslationByKey(context, keyName);
        return new Label(report.CurrentLanguage, translation);
    }

    /*
     * Set Multilingual label for Text Component by its name
     * @param {object} context {state: state, report: report, log: log, text: text}
     */
    static function displayLabelByTextName(context) {

        var report = context.report;
        var log = context.log;
        var text = context.text;

        text.Output.Append(getTextTranslationByKey(context, text.Name));

    }

    /*
     * Add quotes to text for Text Component
     * @param {object} context {state: state, report: report, log: log, text: text}
     */
    static function addQuotesToLabel(context) {

        var log = context.log;
        var text = context.text;

        var oldText = text.Output.ToString();
        if (oldText.length <= 0) {
            return;
        }

        var oldText = oldText.Trim();
        if (oldText.slice(oldText.length - 4) === '<br>') {
            oldText = oldText.slice(0, oldText.length - 4);
        }

        text.Output = new TextBuilder();
        text.Output.Append('"' + oldText + '"');

    }
}
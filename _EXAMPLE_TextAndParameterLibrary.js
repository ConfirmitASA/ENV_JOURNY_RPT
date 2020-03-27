/*
class TextAndParameterLibrary {

    //
    // 9 - English
    // 20 - Norwegian
    //

    static var ParameterValuesLibrary = {

        //
        // The standard options for the Code property are 'D', 'M', 'Q', 'Y'
        // Optionally, you can use Question ID for the Code property to have the answer list of a single question as time units
        //

        TimeUnitsWithDefaultValue: [

            { Code:'Y',
                Label: { 9: 'By Year', 20: 'Etter år'},
                TimeUnit:'Year',
                TimeUnitCount: null },

            { Code:'Q',
                Label: { 9: 'By Quarter', 20: 'Etter kvartal'},
                TimeUnit:'Quarter',
                TimeUnitCount: null },

            { Code:'M',
                Label: { 9: 'By Month', 20: 'Etter måned' },
                TimeUnit:'Month',
                TimeUnitCount: null }

        ],

        TimeUnitsNoDefaultValue: [
            //  { Code:'na',
            //  Label: { 9: '', 20: '' },
            //  TimeUnit: null,
            //  TimeUnitCount: null },
            //

            {
                Code:'placeholder',
                Label: { 9: 'Break By', 20: 'TBD' },
                TimeUnit: null,
                TimeUnitCount: null
            },

            {
                Code:'Y',
                Label: { 9: 'Year', 20: 'TBD'},
                TimeUnit:'Year',
                TimeUnitCount: null
            },

            {
                Code:'Q',
                Label: { 9: 'Quarter', 20: 'TBD'},
                TimeUnit:'Quarter',
                TimeUnitCount: null
            },

            {
                Code:'M',
                Label: { 9: 'Month', 20: 'TBD' },
                TimeUnit:'Month',
                TimeUnitCount: null
            }

        ],

        TimePeriods: [

            {
                Code:'ALL',
                Label: { 9: 'All Time', 20: 'Hele tiden' },
                TimeUnit: null//,
                //TimeUnitCount: null
            },

            {
                Code:'YTD',
                Label: { 9: 'Current Year', 20: 'Dette året' },
                TimeUnit:'Year',
                TimeUnitFrom: 0,
                TimeUnitTo: 0
            },

            {
                Code:'QTD',
                Label: { 9: 'Current Quarter', 20: 'Nåværende kvartal' },
                TimeUnit:'Quarter',
                TimeUnitFrom: 0,
                TimeUnitTo: 0
            },

            {
                Code:'MTD',
                Label: { 9: 'Current Month', 20: 'Denne måneden' },
                TimeUnit:'Month',
                TimeUnitFrom: 0,
                TimeUnitTo: 0
            },

            {
                Code:'CUSTOM',
                Label: { 9: 'Custom Dates', 20: 'Tilpassede datoer' },
                TimeUnit: null//,
                //TimeUnitCount: null
            }

        ],

        Distribution: [
            {
                Code:'1',
                Label: { 9: '1-6', 20: '1-6'},
                AnswerCodes: [1, 2, 3, 4, 5, 6],
                AnswerScores: [0, 11.11, 22.22, 33.33, 44.44, 55.56]
            },

            {
                Code:'2',
                Label: { 9: '7-8', 20: '7-8'},
                AnswerCodes: [7, 8],
                AnswerScores: [66.67, 77.78]
            },

            {
                Code:'3',
                Label: { 9: '9-10', 20: '9-10'},
                AnswerCodes: [9, 10],
                AnswerScores: [88.89, 100]
            }
        ],

        Score: [
            {
                Code: '_other',
                Label: { 9: 'Score', 20:'no: Score'}
            }
        ],

        DisplayMode: [
            { Code:'chart', Label: { 9: 'Chart', 20: 'Chart' }},
            { Code:'table', Label: { 9: 'Table', 20: 'Table' }}
        ],

        ResetSortedHitlist: [
            { Code:'firstReset', Label: { 9: 'firstReset', 20: 'firstReset' }},
            { Code:'secondReset', Label: { 9: 'secondReset', 20: 'secondReset' }}
        ]
    };

    static var TextLibrary = {

        NoDataMsg: { 9: 'No data to display', 20: 'Ingen data å vise'},
        LowReportBaseWarning: {9: 'The results are hidden because the report base is low', 20: 'Resultatene er skjult fordi rapportbasen er lav' },
        SensitiveHierarchy: { 9: 'The results are hidden. Even though there are enough responses for the unit, there are small nearby hierarchy groups that could be identified if results for this unit was displayed.', 20: 'Resultatene er skjult. Selv om det er nok svar på enheten, er det små nærliggende hierarkigrupper som kan identifiseres hvis resultatene for denne enheten ble vist.' },
        N: { 9: 'Number of responses', 20: 'Number of responses'},
        Avg: { 9: 'Average', 20: 'Average'},
        Percentage: { 9: 'Percentage', 20: 'TBD'},
        ViewMore: { 9: 'Click to view more', 20: 'Klikk for å se mer'},
        ShowMore: { 9: 'Show more', 20: 'TBD'},
        ShowLess: { 9: 'Show less', 20: 'TBD'},
        Sorting: { 9: 'Click to sort ascending/descending', 20: 'Click to sort ascending/descending'},
        CommentNumber: { 9: 'Number of comments: ', 20:'Number of comments: '},
        Frequence: { 9: 'Frequence', 20:'Frequence'},
        Number: { 9: 'Number', 20:'Number'},
        NumberOfTimesMentioned: { 9: 'Number of times mentioned', 20:'Number of times mentioned'},
        ShareOfAnswers: { 9: 'Share of answers', 20:'Share of answers'},
        NumberOfAnswers: { 9: 'Number of answers', 20:'Number of answers'},
        CollectionPeriod: { 9: 'Collection Period', 20: 'Collection Period'},
        Filters: { 9: 'Filters', 20: 'Filtre'},
        Compare: { 9: 'Compare', 20: 'TBD'},
        FilterSummaryTitle: { 9: 'FILTERS APPLIED FOR THIS REPORT', 20: 'FILTERS APPLIED FOR THIS REPORT'},
        CompareSummaryTitle: { 9: 'COMPARE SETTINGS', 20: 'COMPARE SETTINGS'},
        Invitations: { 9: 'Invitations', 20: 'Invitasjoner'},
        KPI: { 9: "I will recommend company to others.", 20: 'Jeg vil anbefale selskapet til andre.'},
        Responses: { 9: 'Responses', 20: 'Svar'},
        ResponseCounts: { 9: 'Response counts', 20: 'TBD'},
        ResponseFrequency: { 9: 'Response frequency', 20: 'TBD'},
        ResponseRate: { 9: 'Response Rate', 20: 'Svarprosent'},
        Score: { 9: 'Score', 20:'no: Score'},
        Total: { 9: 'Total', 20:'no: Total'},
        Survey: { 9: 'Journey', 20:'Journey'},
        Program: { 9: 'Program', 20:'no: Program'},
        PageIsNotAvailable: { 9: 'Page is not available for the selected program.', 20:'Siden er ikke tilgjengelig for det valgte programmet.'},
        TimePeriod: { 9: 'Time Period', 20:'Tidsperiode'},
        From: { 9: 'From', 20:'Fra'},
        To: { 9: 'To', 20:'Til'},
        Apply: { 9: 'Apply', 20: 'TBD'},
        Reset: { 9: 'Clear all', 20: 'TBD'},
        All: { 9: 'All', 20:'TBD'},
        Waves: { 9: 'Waves:', 20:'Waves:'},
        About: { 9: 'About', 20:'Handle om'},
        CollapseExpand: { 9: 'Collapse/Expand', 20:'Skjul/Utvid'},
        NoQuestionTitle: { 9: 'No question title/text is specified in survey for question ', 20:'Ingen spørsmålstittel / tekst er angitt i spørreundersøkelsen '},
        ReportBase: { 9: 'Report Base:', 20:'Rapport Base:'},
        PleaseSelectQuestions: { 9: 'Please select questions', 20:'TBD'},
        LessThan: { 9: 'Less than', 20:'TBD'},
        MoreThan: { 9: 'More than', 20:'TBD'},
        And: { 9: 'And', 20:'TBD'},

        Favourable: { 9: 'Favourable', 20: 'Gunstig'},
        Neutral: { 9: 'Neutral', 20:'Nøytral'},
        Unfavourable: { 9: 'Unfavourable', 20:'Ugunstig'},

        Positive: { 9: 'Positive', 20: 'Positiv'},
        Negative: { 9: 'Negative', 20:'Negativ'},
        ScoreVsNormValue: { 9: 'Score vs. Norm value', 20:'Resultat vs. Norm verdi'},
        Distribution: { 9: 'Distribution', 20:'Fordeling'},
        BenchmarkSet: { 9: 'Norm:', 20:'no: Norm:'},
        Fav: { 9: 'Score', 20:'Score'},
        FavMinUnfav: { 9: '%Fav-%Unfav', 20:'%Fav-%Unfav'},
        Base: { 9: 'Responses', 20:'no: Responses'},
        BaseVP: { 9: 'Vertical Percent', 20:'Vertikal prosentsats'},
        BenchmarkColumn: { 9: 'EXTERNAL TOP 25%', 20:'EXTERNAL TOP 25%'},

        Question: {9: 'Question:', 20: 'Spørsmål:'},
        ShowScoreBy: {9: 'Show score by:', 20: 'Vis poeng ved:'},
        TagQuestion: {9: 'Tag questions:', 20: 'Tag spørsmål:'},

        SelectQuestions: {9: 'Select questions:', 20: 'Velg spørsmål:'},
        TimeSeries: {9: 'Time series:', 20: 'Tidsserier:'},
        DisplayMode: {9: 'Chart vs. Table:', 20: 'Chart vs. Table:'},

        Results: { 9: 'Results', 20: 'Resultater'},
        BreakBy: { 9: 'Break by:', 20: 'no: Break by:'},
        BreakByTime: { 9: 'Time periods:', 20: 'no: Time periods:'},
        CountsVsPercents: { 9: 'Counts vs. Percent:', 20: 'Teller vs. Prosent:'},
        ResetSorting: { 9: 'Reset Sorting', 20:'no: Reset Sorting'},
        UpToCard: { 9: 'Up to Card', 20:'no: Up to Card'},

        ResponseRateByTime: { 9: 'Response Rate By Time:', 20: 'Response Rate etter tid:'},
        ResponseRateDemographics: { 9: 'Demographics', 20: 'Demographics'},
        DistributionBy: { 9: 'Distribution by:', 20: 'Fordeling av:'},

        InQueue: { 9: 'In Queue', 20: 'TBD' },
        Completed: { 9: 'Completed', 20: 'TBD' },
        Error: { 9: 'Error', 20: 'TBD' },

        KPI: { 9: 'KPI', 20: 'no: KPI'},
        CommentsPos: { 9: 'LATEST COMMENTS FROM MORE POSITIVE EMPLOYEES', 20: 'Siste kommentarer fra flere ansatte'},
        CommentsNeg: { 9: 'LATEST COMMENTS FROM MORE NEGATIVE EMPLOYEES', 20: 'Siste kommentarer fra flere negative ansatte'},
        KPITrend: { 9: 'Trends', 20: 'no: Trends'},
        SelectQsToFilterBy: { 9: 'Latest comments are filtered by:', 20: 'no: Latest comments are filtered by:'},

        Benchmark: { 9: 'Benchmark', 20: 'Benchmark'},

        KPI_InfoTooltip: { 9: 'This widget provides...', 20: 'Denne widgeten gir'},
        KPITrend_InfoTooltip: { 9: 'KPITrend_InfoTooltip', 20: 'TBD'},
        KPICommentPos_InfoTooltip: { 9: 'KPICommentPos_InfoTooltip', 20: 'TBD'},
        KPICommentNeg_InfoTooltip: { 9: 'KPICommentNeg_InfoTooltip', 20: 'TBD'},
        Trend_InfoTooltip: { 9: 'Trend_InfoTooltip', 20: 'TBD'},
        Results_InfoTooltip: { 9: 'Results_InfoTooltip', 20: 'TBD'},
        Categorical_InfoTooltip: { 9: 'Categorical_InfoTooltip', 20: 'TBD'},
        CategoricalDetails_InfoTooltip: { 9: 'CategoricalDetails_InfoTooltip', 20: 'TBD'},
        Comments_InfoTooltip: { 9: 'Comments_InfoTooltip', 20: 'TBD'},
        RR_InfoTooltip: { 9: 'RR_InfoTooltip', 20: 'TBD'},
        RRDistr_InfoTooltip: { 9: 'RRDistr_InfoTooltip', 20: 'TBD'},
        RRByTime_InfoTooltip: { 9: 'RRByTime_InfoTooltip', 20: 'TBD'},

        _for: {9: 'for', 20: 'no: for'},

        //page names should be specified here
        //if you want page names in EXCEL EXPORT to be changed, change it manually in export package
        Page_KPI: { 9: 'Key Indicator', 20: 'Key Indicator'},
        Page_Trends: { 9: 'Trends', 20: 'Trends'},
        Page_Results: { 9: 'Main Results', 20: 'Resultater'},
        Page_Categorical_: { 9: 'Other Results', 20: 'TBD'},
        Page_CategoricalDrilldown: { 9: 'Hidden Page', 20: 'Hidden Page'},
        Page_Comments: { 9: 'Comments', 20: 'Kommentarer'},
        Page_Wordclouds: { 9: 'Wordclouds', 20: 'TBD'},
        Page_WordcloudsPDF: { 9: 'Wordclouds', 20: 'TBD'},
        Page_Response_Rate: { 9: 'Response Rate', 20: 'Svarprosent'},
        Page_ExportFilterSummary: { 9: 'Global Filter Summary', 20: 'no: Global Filter Summary'},

        // page descriptions displayed below the page title
        Page_KPI_description: { 9: 'Here, you will find an overview including the overall score over time and the latest open comments.', 20: 'Here, you will find an overview including the overall score over time and the latest open comments.'},
        Page_Trends_description: { 9: 'Below, you will see the trendline based on the chosen question. You are able to show specific information from the filter menu in the left side of the screen', 20: 'Below, you will see the trendline based on the chosen question. You are able to show specific information from the filter menu in the left side of the screen.'},
        Page_Results_description: { 9: 'Here, you will find the results of the questions. You can sort by clicking on the desired parameter and access filters on the screen.', 20: 'Here, you will find the results of the questions. You can sort by clicking on the desired parameter and access filters on the screen.'},
        Page_Categorical__description: { 9: 'Here, you will find all the answers from the categorical questions. You are able to dive into the results by clicking on SHOW MORE and use the filters to the left.', 20: 'Here, you will find all the answers from the categorical questions. You are able to dive into the results by clicking on SHOW MORE and use the filters to the left.'},
        Page_CategoricalDrilldown_description: { 9: '', 20: ''},
        Page_Comments_description: { 9: 'Below, you will find all the open comments and the related score for the selected question. You can select different questions from the filter menu to the left', 20: 'Below, you will find all the open comments and the related score for the selected question. You can select different questions from the filter menu to the left.'},
        Page_Wordclouds_description: { 9: 'Here, you will find word clouds for the open comment questions.', 20: 'Here, you will find word clouds for the open comment questions.'},
        Page_WordcloudsPDF_description: { 9: 'Here, you will find word clouds for the open comment questions.', 20: 'Here, you will find word clouds for the open comment questions.'},
        Page_Response_Rate_description: { 9: 'Below, you will see the trendline of the response rate. You are able to show specific information from the filter menu in the left side of the screen.', 20: 'Below, you will see the trendline of the response rate. You are able to show specific information from the filter menu in the left side of the screen.'},
        Page_ExportFilterSummary_description: { 9: 'TBD', 20: 'TBD'},

        Page_Categorical_TopAnswers: { 9: 'TOP 3 ANSWERS TO', 20: 'TBD' },

        // trend chart titles and descriptions per page
        Page_Response_Rate_Trend: { trendTitle: {9: '', 20: ''}, trendDescription: {9: 'Here, you see the trendline of the response rate', 20: ''} },
        Page_KPI_Trend: { trendTitle: {9: 'Key Indicator', 20: ''}},
        Page_Trends_Trend: { trendTitle: {9: 'Trend Line', 20: ''}, trendSubTitle: {9: '', 20: ''}}
    }
}
*/
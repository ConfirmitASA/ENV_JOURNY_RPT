/*

public class Config {

  //================================================================================
  // THEME
  //================================================================================
  static const logo = 'https://author.euro.confirmit.com/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/ENNOVA%20TEMPLATE%20%28Reportal%29/ennova-logo.PNG';
  static const headerBackground = '#FFFFFF';
  static const primaryRedColor = '#c8a4a6';
  static const primaryGreenColor = '#a2ccc1';
  static const primaryGreyColor = '#E5E5E5';
  static const kpiColor = '#0098db';
  static const kpiColor_dark = '#0118A8';
  static const verbatimPositiveColor = '#91AD80';
  static const verbatimNegativeColor = '#A04E53';
  static var pieColors = ['#7ab800', '#ffa100', '#dadada', '#989898', '#ff6100']; // [negative, positive, neutral_dark, neutral_light]

  // Bar chart in the Results table. Check ReusableRecodingId to make sure colors match categories
  // There can only be 3 types of bars: Positive, Neutral and Negative
  // For instance [Very agree and Agree] are Positive, [Neutral] is neutral, [Somewhat negative, Negative and Very Negative] are Negative
  static var barChartColors_Distribution = [{color: '#91AD80', label: 'Positive', type: 'Positive'},
                                 			{color: '#D9D9D9', label: 'Neutral', type: 'Neutral'},
                                 			{color: '#A04E53', label: 'Negative', type: 'Negative'}];


  static var barChartColors_NormVsScore = [{color: '#7ab800', label: 'Positive'},
                                           {color: '#ffa100', label: 'Negative'}];

  static var barChartColors_Categorical = [{color: '#888888'},
                                           {color: '#eaeaea'}];

  static var categoricalCardLineColor = "#e8e8e8";

  static var wordcloudMainColor = '#8b565a';
  static var wordcloudSecondaryColor = '#888888';


  static var showThreeDotsCardMenu = true;

  static var exportWindowStylingFiles = {"page1CSS": "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/ENNOVA%20TEMPLATE%20%28Reportal%29/export-window__iframe-first-page.css",
                                         "page1JS": "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/ENNOVA%20TEMPLATE%20%28Reportal%29/export-window__iframe-first-page.js",
                                         "page2CSS": "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/ENNOVA%20TEMPLATE%20%28Reportal%29/export-window__iframe-second-page.css",
                                         "page2JS": "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/ENNOVA%20TEMPLATE%20%28Reportal%29/export-window__iframe-second-page.js"
   };

 // pdf: [Export format, Page orientation, Paper size, Email recipients, Comment to recipients, Encrypt File, Export scope, Report Language, Start time]
 // indexes: [0, 1, 2, 3, 7, 9, 11, 12, 13];
  static var pdfExportSettingsOptions = {flags: [true, false, false, true, true, false, true, false, false], indexes:[0, 1, 2, 3, 7, 9, 11, 12, 13]};

 //excel: [Export format, Email recipients,  Comment to recipients, Encrypt File,  Display filter summary on every page , Export tables to separate sheets, Export report to a single sheet, Export scope, Report Language, Start time]
 // indexes: [0, 1, 5, 7, 8, 9, 10, 12, 13, 14]
  static var excelExportSettingsOptions = {flags: [true, true, true, false, false, false, false, true, false, false], indexes: [0, 1, 5, 7, 8, 9, 10, 12, 13, 14]};

  //excelScopeExt: [Export format, Email recipients,  Comment to recipients, Encrypt File, Include table of contents,  Display filter summary on every page , Export tables to separate sheets, Export report to a single sheet, Export scope, Report Language, Start time]
 // indexes: [0, 1, 5, 7, 8, 9, 10, 12, 13, 14]
  static var excelScopeExtExportSettingsOptions = {flags: [true, true, true, false, false, false, false, false, true, false, false], indexes: [0, 1, 5, 7, 8, 9, 10, 11, 13, 14, 15]};

  //ppt: [Export format, Email recipients, Comment to recipients, Encrypt File, Export scope, Report Language, Start time]
 // indexes: [0,  1, 5, 7, 9, 10, 11]
  static var pptExportSettingsOptions = {flags: [true, true, true, false, true, false, false], indexes: [0,  1, 5, 7, 9, 10, 11]};


  //to delete Encrypt File option for end users
  static var encryptFileOptionIndex = {
    pdf: 5,
    excel: 3,
    excelScopeExt: 3,
    ppt: 3
  };

//
// to update colors also go to 'Layout and Styles' section -> Styles -> Palletes -> EnnovaPallete
//

static const Decimal = 0;

//================================================================================
// DATA SUPPRESSION (more info: SuppressUtil)
//================================================================================

static const SuppressSettings = {

    ReportBaseSuppressValue: 5,  // Min number of responses (response = question specified below in Survey Config -> Response: {qId: 'status', codes: ['complete']})

    TableSuppressValue: 5,        // Min number of answers in the Aggregated Table
    VerbatimSuppressValue: 5,     // Min number of answers in the Verbatim Table
    CommentSuppressValue: 5,      // Min number of answers in the Hitlist
    CategoricalSuppressValue: 30, // Min number of answers for cards on the Categorical page

    // minGap: min difference between neighbour units
    // unitSufficientBase: min number of the responses when a unit is always shown irrespective of <minGap> requirement
    HierarchySuppress: { minGap: 0, unitSufficientBase: 0}

};

// Database Hierarchy Descriptor

static const schemaId = 8907;
static const tableId = 19882;
static const relationId = 12044;


//================================================================================
// README
//================================================================================

//
// The following pattern is used for question ids: questionID.answer_precode.other.
// SINGLE: single, single_ltr
// GRID: grid, grid_ltr
// GRID'S SUBQUESTION: grid.1, grid_ltr.1
// OTHER ANSWER: q1_ltr.99.other
// ANWSER OF OPEN TEXT LIST: open_text.answer_precode
//


static var Surveys = [

    //================================================================================
    // ENTRY/CANDIDATE SURVEY
    //================================================================================
    {
        Source: 'ds3',
        isHidden: false,
        AvailableForRoles: null, // null - available for all roles, [] - not available for any role, ['role1', 'role2'] - available for 2 roles
        Filters: ['Level2unitname'],  // filters used on the Filter Panel
        FiltersFromSurveyData: ['AgeGroup', 'SeniorityGroup'], //not bg vars only, used in filter panel
        IsTimePeriodFilterHidden: false,
        HierarchyQuestion: null,
        DateQuestion: 'interview_end',
        MailingDateQuestion: 'FirstEmailedDate',
        IsCollectionPeriodVisible: false,
        Invitation: {qId: 'smtpStatus', codes: ['messagesent']},
        Response: {qId: 'status', codes: ['complete']},
        ReusableRecodingId:  'rec0',
        ReusableRecoding_PositiveCols: [1],
        ReusableRecoding_NegativeCols: [3],
        NA_answerCode: '11', //null
        MaxCharacterNumberInOpenText: 50,
        DefaultPage: 'KPI',

        DimensionsForSurveysSchemaId: null,
        DimensionsForSurveysTable: null,


        // Page Key KPI

        Page_KPI: {
            isHidden: false,
            KPI: ['q1_2'],
            KPIPositiveAnswerCodes: ['9', '10'],
            KPINegativeAnswerCodes: ['0', '1', '2', '3', '4', '5', '6'],
            KPIThreshold: {
                '#93c5b9': [0, 100]
            },
            KPIType: 'full',
            KPIComment: 'q1_2_1_eng',
            NumberOfCommentsToShow: 3
        },

        // Page Trend

        Page_Trends: {
            isHidden: false,
            TrendQuestions: ['q1_1','q1_2']
        },

        // Page Results

        Page_Results: {
            isHidden: false,

            BenchmarkProject: null, //'p1872720360',
            BenchmarkSet: [], //[{Code: 'hp', Label: { 9: 'Benchmark: HP', 20: 'Benchmark: HP'}}, {Code: 'fs', Label: { 9:'Benchmark: FS', 20: 'Benchmark: FS'}}],

            Dimensions: ['RECOMMENDING', 'FIRST_LEARN', 'JOB_DESCRIPTION', 'TEST', 'JOB_INTERVIEW', 'FINAL_FEEDBACK', 'CLEAR_AND_TRANSPARENT_PROCESS'],
            ResultStatements: null, //['q1_1', 'q1_2', 'q2_2', 'q4_1', 'q4_2', 'q4_3', 'q5_2', 'q6_2', 'q6_3', 'q6_4', 'q6_5', 'q6_6', 'q6_7', 'q6_8', 'q6_9','q7_1','q8_1', 'q8_2', 'q8_3'],
            BreakVariables : [],
            BreakByTimeUnits: true,
            ScoreType: 'AVG'
        },

        // Page Categorical

        Page_Categorical_: {
            isHidden: false,
            ResultCategoricalQuestions: ['q5_1', 'q6_1'],    // single-questions for upper cards
            ResultMultiCategoricalQuestions: ['q2_1'],  // multi-questions for bottom cards
            topN: 3, // number of top options displayed in cards
            BreakVariables : [],
            BreakByTimeUnits: true
        },

        // Page Comments

        Page_Comments: {
            isHidden: false,
            staticColumns: [],
            Comments: ['q1_2_1_eng', 'q2_3', 'q3_1', 'q4_4', 'q5_3'],
            ScoresForComments: ['q1_2'], // to display icons the copy of Score question should be used
            TagsForComments: [] //['AgeGroup', 'SeniorityGroup']
        },

        // Page Wordclouds
        Page_Wordclouds: {
            isHidden: false,
            WordcloudQuestions: ['q1_2_1_eng']
        },

        // Page Wordclouds
        Page_WordcloudsPDF: {
            isHidden: true,
            WordcloudQuestions: ['q1_2_1_eng'], //need to duplicate the above setting here
            NumOfTopWordsInExport: 17
        },

        // Page Response Rate

        Page_Response_Rate: {
            isHidden: false,
            DemographicsQuestions: ['AgeGroup', 'SeniorityGroup']
        },

        Page_ExportFilterSummary: {
            isHidden: true
        }
    },

    //================================================================================
    // ONBOARDING SURVEY
    //================================================================================
    {
        Source: 'ds4',
        isHidden: false,
        AvailableForRoles: null, // null - available for all roles, [] - not available for any role, ['role1', 'role2'] - available for 2 roles
        Filters: ['Level2unitname'],  // filters used on the Filter Panel
        FiltersFromSurveyData: ['AgeGroup', 'SeniorityGroup'], //not bg vars only, used in filter panel
        IsTimePeriodFilterHidden: false,
        HierarchyQuestion: null,
        DateQuestion: 'interview_end',
        MailingDateQuestion: 'FirstEmailedDate',
        IsCollectionPeriodVisible: false,
        Invitation: {qId: 'smtpStatus', codes: ['messagesent']},
        Response: {qId: 'status', codes: ['complete']},
        ReusableRecodingId:  'rec0',
        ReusableRecoding_PositiveCols: [1],
        ReusableRecoding_NegativeCols: [3],
        NA_answerCode: '11', //null
        MaxCharacterNumberInOpenText: 50,
        DefaultPage: 'KPI',

        DimensionsForSurveysSchemaId: null,
        DimensionsForSurveysTable: null,


        // Page Key KPI

        Page_KPI: {
            isHidden: false,
            KPI: ['q1_2'],
            KPIPositiveAnswerCodes: ['9', '10'],
            KPINegativeAnswerCodes: ['0', '1', '2', '3', '4', '5', '6'],
            KPIThreshold: {
                '#93c5b9': [0, 100]
            },
            KPIType: 'full',
            KPIComment: 'q1_2_1_eng',
            NumberOfCommentsToShow: 3
        },

        // Page Trend

        Page_Trends: {
            isHidden: false,
            TrendQuestions: ['q1_3', 'q1_2', 'q1_1']
        },

        // Page Results

        Page_Results: {
            isHidden: false,

            BenchmarkProject: null, //'p1872720360',
            BenchmarkSet: [], //[{Code: 'hp', Label: { 9: 'Benchmark: HP', 20: 'Benchmark: HP'}}, {Code: 'fs', Label: { 9:'Benchmark: FS', 20: 'Benchmark: FS'}}],

            Dimensions: ['OVERALL_EVALUATION', 'IMMEDIATE_MANAGER', 'PRACTICALITIES', 'MY_JOB', 'MY_TEAM', 'CONNECTING', 'PROCESS_KNOWLEDGE', 'PERFORMANCE_READYNESS', 'THE_BIG_PICTURE', 'POSITIVE_CONFIRMATION'],
            ResultStatements: null, //['q1_1', 'q1_2', 'q1_3', 'q2_1', 'q2_2', 'q2_3', 'q2_4', 'q3_1', 'q3_2', 'q4_1', 'q4_2', 'q4_3', 'q5_1', 'q5_2', 'q6_1', 'q6_2', 'q6_3', 'q7_1', 'q7_2', 'q8_1', 'q8_2', 'q8_3', 'q9_1', 'q9_2', 'q10_1', 'q10_2'],
            BreakVariables : [],
            BreakByTimeUnits: true,
            ScoreType: 'AVG'
        },

        // Page Categorical

        Page_Categorical_: {
            isHidden: true,
            ResultCategoricalQuestions: [],    // single-questions for upper cards
            ResultMultiCategoricalQuestions: [],  // multi-questions for bottom cards
            topN: 3, // number of top options displayed in cards
            BreakVariables : [],
            BreakByTimeUnits: true
        },

        // Page Comments

        Page_Comments: {
            isHidden: false,
            staticColumns: [],
            Comments: ['q1_2_1_eng', 'q2_5', 'q3_3', 'q4_4', 'q5_3', 'q6_4', 'q11_1'],
            ScoresForComments: ['q1_1', 'q1_2_categories'], // to display icons the copy of Score question should be used
            TagsForComments: []
        },

        // Page Wordclouds

        Page_Wordclouds: {
            isHidden: false,
            WordcloudQuestions: ['q1_2_1_eng']
        },

        // Page Wordclouds
        Page_WordcloudsPDF: {
            isHidden: true,
            WordcloudQuestions: ['q1_2_1_eng'], //need to duplicate the above setting here
            NumOfTopWordsInExport: 17
        },

        // Page Response Rate
        Page_Response_Rate: {
            isHidden: false,
            DemographicsQuestions: ['AgeGroup', 'SeniorityGroup']
        },

        Page_ExportFilterSummary: {
            isHidden: true
        }
    },

    //================================================================================
    // EXIT SURVEY
    //================================================================================
    {

        Source: 'ds2',
        isHidden: false,
        AvailableForRoles: null,//['DB_user'], // null - available for all roles, [] - not available for any role, ['role1', 'role2'] - available for 2 roles
        Filters: ['Country', 'Manager', 'Level2unitname', 'ExitType'],  // filters used on the Filter Panel
        FiltersFromSurveyData: ['AgeGroup', 'SeniorityGroup'], //not bg vars only, used in filter panel
        IsTimePeriodFilterHidden: false,
        HierarchyQuestion: null,
        DateQuestion: 'interview_end',
        MailingDateQuestion: 'FirstEmailedDate',
        IsCollectionPeriodVisible: false,
        Invitation: {qId: 'smtpStatus', codes: ['messagesent']},
        Response: {qId: 'status', codes: ['complete']},
        ReusableRecodingId:  'rec0', // for distribution on results page
        ReusableRecoding_PositiveCols: [3],
        ReusableRecoding_NegativeCols: [1],
        NA_answerCode: '11', //null
        DefaultPage: 'KPI',

        DimensionsForSurveysSchemaId: null,
        DimensionsForSurveysTable: null, //table in DB Schema (setting above) which stores dimension ids used in a pulse survey

        // Page Key KPI

        Page_KPI: {
            isHidden: false,
            KPI: ['q1_3'],
            KPIPositiveAnswerCodes: ['9', '10'],
            KPINegativeAnswerCodes: ['0', '1', '2', '3', '4', '5', '6'],
            KPIThreshold: {
                '#93c5b9': [0, 100]
            },
            KPIType: 'full',
            KPIComment: 'q1_4_eng',
            NumberOfCommentsToShow: 3
        },

        // Page Trend

        Page_Trends: {
            isHidden: false,
            TrendQuestions: ['q1_1', 'q1_2', 'q1_3']
        },

        // Page Results

        Page_Results: {
            isHidden: false,

            BenchmarkProject: null, //'p1872720360',
            BenchmarkSet: [], //[{Code: 'hp', Label: { 9: 'Benchmark: HP', 20: 'Benchmark: HP'}}, {Code: 'fs', Label: { 9:'Benchmark: FS', 20: 'Benchmark: FS'}}],

            Dimensions: ['OVERALL_EVALUATION', 'THE_JOB_LEAVING', 'LEADERSHIP', 'ONBOARDING'],
            ResultStatements: null, //['q1_1', 'q1_2', 'q1_3', 'q3_1', 'q3_2', 'q3_3', 'q3_4', 'q3_5', 'q3_6', 'q4_1', 'q4_2'],
            BreakVariables : [],
            BreakByTimeUnits: true,
            ScoreType: 'AVG'
        },

        // Page Categorical

        Page_Categorical_: {
            isHidden: false,
            ResultCategoricalQuestions: ['q2_1', 'q3_7', 'q3_8', 'q5_7', 'q5_4', 'q5_6', 'q5_2'],    // single-questions for upper cards
            ResultMultiCategoricalQuestions: ['q2_2'],  // multi-questions for bottom cards
            topN: 3, // number of top options displayed in cards
            BreakVariables : [],
            BreakByTimeUnits: true
        },

        // Page Comments

        Page_Comments: {
            isHidden: false,
            staticColumns: [],
            Comments: ['q1_4_eng', 'q2_3', 'q3_9', 'q3_11', 'q4_3', 'q5_1', 'q6_1'],
            ScoresForComments: ['q1_3', 'q1_1'], // to display icons the copy of Score question should be used
            TagsForComments: []
        },

        // Page Wordclouds

        Page_Wordclouds: {
            isHidden: false,
            WordcloudQuestions: ['q1_4_eng']
        },

        // Page Wordclouds
        Page_WordcloudsPDF: {
            isHidden: true,
            WordcloudQuestions: ['q1_2_1_eng'], //need to duplicate the above setting here
            NumOfTopWordsInExport: 17
        },

        // Page Response Rate

        Page_Response_Rate: {
            isHidden: false,
            DemographicsQuestions: ['ExitType', 'AgeGroup', 'SeniorityGroup']
        },

        Page_ExportFilterSummary: {
            isHidden: true
        }

    }


];


}

*/
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
  static var pieColors = ['#7ab800', '#ffa100', '#dadada', '#989898', '#ff6100']; // [negative, positive, neutral_dark, neutral_light]

  // Bar chart in the Results table. Check ReusableRecodingId to make sure colors match categories
  // There can only be 3 types of bars: Positive, Neutral and Negative
  // For instance [Very agree and Agree] are Positive, [Neutral] is neutral, [Somewhat negative, Negative and Very Negative] are Negative
  static var barChartColors_Distribution = [{color: '#91AD80', label: 'Favourable', type: 'Positive'},
                                 			{color: '#D9D9D9', label: 'Neutral', type: 'Neutral'},
                                 			{color: '#A04E53', label: 'Unfavourable', type: 'Negative'}];


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
                                         "page2JS": "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/Ennova%20Journey%20Redesign%20Test/export-window__iframe-second-page_test.js"
   };

 // pdf: [Export format, Page orientation, Paper size, Email recipients, Comment to recipients, Encrypt File, Export scope, Report Language, Start time]
 // indexes: [0, 1, 2, 3, 7, 9, 11, 12, 13];
  static var pdfExportSettingsOptions = {flags: [true, false, false, true, true, false, true, true, false], indexes:[0, 1, 2, 3, 7, 9, 11, 12, 13]};

 //excel: [Export format, Email recipients,  Comment to recipients, Encrypt File,  Display filter summary on every page , Export tables to separate sheets, Export report to a single sheet, Export scope, Report Language, Start time]
 // indexes: [0, 1, 5, 7, 8, 9, 10, 12, 13, 14]
  static var excelExportSettingsOptions = {flags: [true, true, true, false, false, false, false, true, true, false], indexes: [0, 1, 5, 7, 8, 9, 10, 12, 13, 14]};

  //ppt: [Export format, Email recipients, Comment to recipients, Encrypt File, Export scope, Report Language, Start time]
 // indexes: [0,  1, 5, 7, 9, 10, 11]
  static var pptExportSettingsOptions = {flags: [true, true, true, false, true, true, false], indexes: [0,  1, 5, 7, 9, 10, 11]};


//
// to update colors also go to 'Layout and Styles' section -> Styles -> Palletes -> EnnovaPallete
//

static const Decimal = 0;

//================================================================================
// DATA SUPPRESSION (more info: SuppressUtil)
//================================================================================

static const SuppressSettings = {

    ReportBaseSuppressValue: 1,  // Min number of responses (response = question specified below in Survey Config -> Response: {qId: 'status', codes: ['complete']})

    TableSuppressValue: 1,        // Min number of answers in the Aggregated Table
    VerbatimSuppressValue: 0,     // Min number of answers in the Verbatim Table
    CommentSuppressValue: 0,      // Min number of answers in the Hitlist
    CategoricalSuppressValue: 0, // Min number of answers for cards on the Categorical page

    // minGap: min difference between neighbour units
    // unitSufficientBase: min number of the responses when a unit is always shown irrespective of <minGap> requirement
    HierarchySuppress: { minGap: 0, unitSufficientBase: 10}

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
    // PULSE SURVEY
    //================================================================================
    {

        Source: 'ds1',
        isHidden: false,
        AvailableForRoles: null,//['DB_user'], // null - available for all roles, [] - not available for any role, ['role1', 'role2'] - available for 2 roles
        Filters: ['Segment_eef', 'Intenttostay', 'Occupation', 'Gender', 'Age', 'Generation', 'Performance_rating', 'Tenure',  'Geographic_region', 'Country', 'Job_function'],  // filters used on the Filter Panel
        FiltersFromSurveyData: ['q1', 'q2'], //not bg vars only, used in filter panel
        IsTimePeriodFilterHidden: false,
        HierarchyQuestion: null,
        DateQuestion: 'interview_end',
        MailingDateQuestion: 'smtpStatusDate',
        Invitation: {qId: 'smtpStatus', codes: ['messagesent']},
        Response: {qId: 'status', codes: ['complete']},
        ReusableRecodingId:  'rec6', // for distribution on results page
        ReusableRecoding_PositiveCols: [3],
        ReusableRecoding_NegativeCols: [1],
        NA_answerCode: null,
        DefaultPage: 'KPI',

        DimensionsForSurveysSchemaId: null,
        DimensionsForSurveysTable: null, //table in DB Schema (setting above) which stores dimension ids used in a pulse survey

        // Page Key KPI

        Page_KPI: {
            isHidden: false,
            KPI: ['q1', 'q2', 'q3', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'],
            KPIPositiveAnswerCodes: [],
            KPINegativeAnswerCodes: [],
            KPIThreshold: {
                '#93c5b9': [0, 100]
            },
            KPIType: 'full',
            KPIComment: 'q186',
            NumberOfCommentsToShow: 3
        },

        // Page Trend

        Page_Trends: {
            isHidden: false,
            TrendQuestions: ['q1']
        },

        // Page Results

        Page_Results: {
            isHidden: false,

            BenchmarkProject: 'p1872720360',
            BenchmarkSet: [{Code: 'hp', Label: { 9: 'Benchmark: HP', 20: 'Benchmark: HP'}}, {Code: 'fs', Label: { 9:'Benchmark: FS', 20: 'Benchmark: FS'}}],
            BenchmarkViewType: 'value',

            Dimensions: ['Agility', 'AuthorityEmpowerment', 'ClearDirection', 'Collaboration', 'Communication'],
            ResultStatements: null,
            BreakVariables : [],
            BreakByTimeUnits: true,
            ScoreType: '%Fav'
        },

        // Page Categorical

        Page_Categorical_: {
            isHidden: false,
            ResultCategoricalQuestions: ['q1', 'q2'],    // single-questions for upper cards
            ResultMultiCategoricalQuestions: ['q19', 'q148'],  // multi-questions for bottom cards
            topN: 3, // number of top options displayed in cards
            BreakVariables : [],
            BreakByTimeUnits: true
        },

        // Page Comments

        Page_Comments: {
            isHidden: false,
            staticColumns: [],
            Comments: ['q186', 'q187', 'q188', 'q189', 'q190',  'q225new', 'q226new'],
            ScoresForComments: ['OM04'], // to display icons the copy of Score question should be used
            TagsForComments: []
        },

        // Page Wordclouds

        Page_Wordclouds: {
            isHidden: false,
            WordcloudQuestions: ['wc_comments']
        },


        // Page Response Rate

        Page_Response_Rate: {
            isHidden: false,
            DemographicsQuestions: ["Gender", "Intenttostay", "Tenure", "Occupation", "Country", "Age", "Segment_eef"]
        },

        Page_ExportFilterSummary: {
            isHidden: true
        }

    },

    //================================================================================
    // EXIT SURVEY WITH GRIDS
    //================================================================================
    {
        Source: 'ds2',
        isHidden: false,
        AvailableForRoles: [], // null - available for all roles, [] - not available for any role, ['role1', 'role2'] - available for 2 roles
        Filters: ['Country', 'Managerlevel', 'ExitType', 'Businessunit'],  // filters used on the Filter Panel
        FiltersFromSurveyData: ['c_394722'], //not bg vars only, used in filter panel
        IsTimePeriodFilterHidden: false,
        HierarchyQuestion: null,
        DateQuestion: 'interview_start',
        MailingDateQuestion: 'smtpStatusDate',
        Invitation: {qId: 'status', codes: []},
        Response: {qId: 'status', codes: []},
        ReusableRecodingId:  'rec0',
        ReusableRecoding_PositiveCols: [1],
        ReusableRecoding_NegativeCols: [3],
        //SuppressValue: 0,
        NA_answerCode: '11',
        MaxCharacterNumberInOpenText: 50,
        DefaultPage: 'KPI',

        DimensionsForSurveysSchemaId: null,
        DimensionsForSurveysTable: null,


        // Page Key KPI
        Page_KPI: {
            isHidden: false,
            isExported: true,
            KPI: ['s_669457_669458_23133_0.393785'],
            KPIPositiveAnswerCodes: ['1'],
            KPINegativeAnswerCodes: ['3', '4'],
            KPIThreshold: {
                '#8B565A': [0, 50],
                '#7e8286': [50, 80],
                '#36842D': [80, 100]
            },
            KPIType: 'full',
            KPIComment: 'o_393786',
            NumberOfCommentsToShow: 3
        },

        // Page Trend
        Page_Trends: {
            isHidden: false,
            isExported: true,
            TrendQuestions: ['s_669457_669458_23133_0.393783', 's_669457_669458_23133_0.393784', 's_669457_669458_23133_0.393785']
        },

        // Page Results Satements
        Page_Results: {
            isHidden: false,
            isExported: true,
            BenchmarkProject: null,
            BenchmarkSet: null,
            HierarchyBasedComparisons: [], // parent - 1 level up, top - top hierarchy level, number - is specific level
            Dimensions: null,
            ResultStatements: ['s_669457_669458_23133_0.393783', 's_669457_669458_23133_0.393784', 's_669457_669458_23133_0.393785', 's_669415_669416_23133_0.393790', 's_669415_669416_23133_0.393791', 's_669415_669416_23133_0.393792', 's_669415_669416_23133_0.393793', 's_669415_669416_23133_0.393794', 's_669415_669416_23133_0.393795', 's_669399_669400_23133_0.393800', 's_669399_669400_23133_0.393801', 's_672108_672110_23133_0.394720'], // questions for Table
            ResultStatementsTooltipTexts: [""], //'["", "Includes values 1-6", "Includes values 7-8", "Includes values 9-10", "","",""]',
            BreakVariables : [],
            BreakByTimeUnits: true,
            ScoreType: 'Avg'
        },

        // Page Categorical
        Page_Categorical_: {
            isHidden: false,
            isExported: true,
            ResultCategoricalQuestions: ['c_394722', 'c_393787', 'c_393796', 'c_393797', 'c_393804', 'c_393808'],    // single-questions for upper cards
            ResultMultiCategoricalQuestions: ['m_393788','m_394808','m_394809'],  // multi-questions for bottom cards
            topN: 3, // number of top options displayed in cards
            BreakVariables : [],
            BreakByTimeUnits: true
        },

        // Page Wordclouds

        Page_Wordclouds: {
            isHidden: true,
            isExported: true,
            WordcloudQuestions: []
        },

        // Page Comments
        Page_Comments: {
            isHidden: false,
            isExported: true,
            staticColumns: [],
            Comments: ['o_393786','o_393789','o_393798','o_393802','o_394721','o_393805', 'o_393807','o_393810', 'o_393811'],
            ScoresForComments: ['s_669457_669458_23133_0.393785', 's_669457_669458_23133_0.393783'], // to display icons the copy of Score question should be used
            TagsForComments: ['c_394722', 'status']
        },

        // Page Response Rate
        Page_Response_Rate: {
            isHidden: false,
            isExported: true,
            DemographicsQuestions: ['Country', 'Location']
        },

        Page_ExportFilterSummary: {
            isHidden: true,
            isExported: true
        }
    }
];


}

*/
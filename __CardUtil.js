class CardUtil {
    
    /**
    * @memberof CardUtil
    * @function RenderNewCard
    * @description function to generate redesigned cards on Categorical page
    * @param {Object} context - {state: state, report: report, log: log, text: text, pageContext: pageContext}   
    */  
    static function RenderRedesignedCard (context, content, cssClass) {
      
      var report = context.report;
      var state = context.state;
      var text = context.text;
      var log = context.log;
      
      var header = content.header;
      var data = content.data;
      var footer = content.footer;
      var style = content.style;
      
      
      var card = '<article class="card layout__card ' + cssClass + ' "' + (style ? (' style="' + style + '"') : '') + '>' +
                    '<header class="card__header">' + header + '</header>' +
                   '<section class="card__content">' + data + '</section>' +
                   '<footer class="card__footnote footnote">' + footer + '</footer>' +
                 '</article>';   
      
      text.Output.Append(card);  
    }
  }
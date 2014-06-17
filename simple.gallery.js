/*===== Image Gallery =====*/
(function ( $ ) {
    

    $.fn.simpleGallery = function( opt ) {
       

        // This is the easiest way to have default options.
         
        var body =  $('body');
        var gallery = this;
        var li,img, overlayer;

        var def = $.extend( true, {},  $.fn.simpleGallery.def, opt );


        var App = {
            checker: $('<div class="sg-hidden-btn sg-check-all">Check all</div>'),
            selectable: function(arg){
                if(arg.hasClass('selected')){  
                    gallery.find('.sg-hidden-btn').fadeOut('slow');    
                        li.removeClass('selectable ' + def.selectedClass).addClass('item');
                }else{
                    this.checkUnchecked();
                    gallery.find('.sg-hidden-btn').fadeIn('slow');
                        gallery.find('li').toggleClass( "selectable" ).removeClass('item');   
                }  
                arg.toggleClass( def.selectedClass );
            },

            select: function(sel){
                if(!sel.hasClass(def.selectedClass)){
                    sel.addClass(def.selectedClass); 
                      def.onSelect.call(sel); //On select call
                }else{
                    sel.removeClass(def.selectedClass);
                      def.onDeSelect.call(sel); //On select call
                }
                
                if($('li.'+def.selectedClass).length == 0  && gallery.hasClass('all-selected')){
                     $('.').trigger('click');
                }
            },

            check: function(){
               this.checker.toggleClass( def.selectedClass );
               return !gallery.hasClass('all-selected') ? this.checkChecked() : this.checkUnchecked();
            },

            checkChecked: function(){
                gallery.addClass('all-selected'); 
                    li.addClass(def.selectedClass); 
                        this.checker.html('Uncheck all');
            },

            checkUnchecked: function(){
                gallery.removeClass('all-selected'); 
                    li.removeClass(def.selectedClass);
                        this.checker.html('Check all');
            },

            //update
            delete: function(set){
                var elem = $('li.selected');
                if (confirm("Are you sure you want to delete this pictures")) {
                   var toDelete = elem.map(function(i,e){ return $(e).data('i'); });
                    
                    //start delete
                    toDelete = JSON.stringify($.makeArray(toDelete));

                    $.post(def.deleteUrl, { items:toDelete })
                     .done(function( data ) {
                            var status = parseInt(data)==1 ? true:false;

                            var msg = status ? def.deleteConfirmMsg : def.deleteErrMsg;
                            var sts = $(def.statusContainer);
                                sts.hide().html(msg).fadeIn();
                                    setTimeout(function(){sts.fadeOut('slow')},3000);
                           
                            if(status){
                                //element DOM remove
                                 console.log('element: '+elem);
                                 elem.fadeOut('slow').remove();
                                 if(gallery.find('li').length == 0){
                                    gallery.html(def.noFilesMsg);
                                 }
                               /* elem.each(function(i){
                                    setTimeout(function(){
                                        var t  =  $(this);
                                        console.log('ELEMENT INSIDE '+t);
                                        t.fadeOut('slow').remove();
                                    }, i*100);
                                });*/
                            }
                     });
                } 
            },
            //-end-update
            construct: function(){
                //Create tthe main container
                gallery.addClass(def.class)
                    .append('<div class="sg-buttons"></div>'); //Add Buttons -- Check button
               
               var imgCount = gallery.find('img').length; 

               //Format the list items
               if(imgCount > 0){
                   gallery.find('img').each(function(){
                        var id = $(this).data('id') ? $(this).data('id') : 0;
                        var href = $(this).data('img') ? $(this).data('img'):'';
                        var img = $(this).data('i') ? $(this).data('i'):'';
                            $(this).wrap('<li data-id="'+id+'" data-href="'+href+'" data-i="'+img+'" class="item"></li>');
                   });  

                    //Create the list
                    gallery.wrapInner('<ul class="sg-lister"></ul>');      

                    //Add status
                   gallery.prepend('<div id="sg-status" class="hide"></div>');
                    
                    //Add buttons
                    gallery.find('.sg-buttons')
                        .append('<div class="'+def.btnClass+'">Checkable</div>')
                        .append(this.checker)
                        .append('<div class="sg-hidden-btn sg-delete">Delete</div>');     

                    //Append overlayer
                    body.append('<div class="sg-overlayer"></div>');        

                    overlayer = $('.sg-overlayer');
                    li  = gallery.find('li');
                    img = li.find('img');
                }else{
                    gallery.html(def.noFilesMsg);
                } 
            },

            init: function(){

                //Construct the html
                App.construct();

                body.on('click', '.item', function(){
                  var x =   li.map(function(){
                        return $(this).data('href');
                    })
                });
                 //Append events on the li items elements
                body.on('click', '.selectable', function(){
                   App.select($(this));  
                });

                //Add events to buttons
                    //Check button
                    $('.'+def.btnClass).click(function(){
                        App.selectable($(this));
                    })

                    //Check all
                    this.checker.click(function(){
                        App.check();
                    });  

                    //Delete 
                    $('.sg-delete').click(function(){
                        App.delete();
                    }); 
                return gallery;
            }
        };
            
        return App.init();
 
    };

    $.fn.simpleGallery.def = {
            class: "image-gallery",
            btnClass: "sg-check-button",
            selectedClass: 'selected',
            canDelete: true,
            width: 800,
            height:600,
            deleteUrl: 'delete.php',
            statusContainer: '#sg-status',
            deleteConfirmMsg: 'The files have been succesfully deleted!',
            deleteErrMsg: 'Erorr on deleting the items',
            noFilesMsg: 'No files in the gallery',

            //if an image is selected
            onSelect: function(){},

            //if an image is deselected
            onDeSelect: function(){},

            //if images are deleted
            onDelete: function(){}
    }
}( jQuery ));
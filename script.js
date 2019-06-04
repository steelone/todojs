$(function (){

    let array=[];
    const $tasksList = $("#tasksList");
    const $tasksInput = $("#tasksInput");
    const $notification = $("#notification");

    const displayNotification = function() {
        if (!$tasksList.children().length) {
            $notification.fadeIn("fast");
        } else {
            $notification.css("display", "none")
        }
    }
    $(document).on('keypress',function(e) {
        if(e.which == 13){//Enter key pressed
            $('#taskAdd').click();//Trigger search button click event
        }
    });

    var checkInput = function(value){
        // console.log('VALUE:'+value);
        let empty=+value;
        if(empty == 0) {
            // alert('Incorrect data');
            return true;
        } else {return false;}
    };
    
    let i = 0;
    $("#taskAdd").on("click", function(){
        const value=_.escape($('#tasksInput').val());
        checkInput(value);
        
        if(!value || checkInput(value) === true) {return false;}
        const uniq = Math.floor((Math.random() * 10000) + 1);
        array.push({ id: uniq, value: value, checked:false});
        $tasksList.append("<li id="+uniq+" class='list-group-item'><input id='selectLi' type='checkbox'/>" + value + "<button id='delete' class='delete btn btn-danger'>x</button></li>")
        // array[id].checked = true;

        $tasksInput.val("");

        displayNotification();

        $(":checkbox").change(function(){
            let $parent = $(this).parent();
            let id = $parent.attr('id');
            console.log( array );
            console.log( this.id );
    
            if(this.checked) { // checked
                // objArray = [ { foo: 1, bar: 2}, { foo: 3, bar: 4}, { foo: 5, bar: 6} ];
                // let result = array.map(a => a.checked);
                // console.log( result );
                // console.log( 'UNIQ:'+uniq );
                // console.log( 'ID:'+id );
                
                array.forEach(element => {
                    $.each( element, function( key, value ) {
                        if (element.id == id){
                            element.checked = true;
                        }
                        // console.log( key + ": " + value );
                    });
                });

                $parent.css("text-decoration", "line-through");
                    
            } else { // cancel checked
                $parent.css("text-decoration", "none");
                                
                array.forEach(element => {
                    $.each( element, function( key, value ) {
                        if (element.id == id){
                            element.checked = false;
                        }
                        // console.log( key + ": " + value );
                    });
                });
            }
        })

        $(".delete").on("click", function(){
            let $parent = $(this).parent();
            // console.log($parent);
            $parent.css("display", "none");
            setTimeout(function(){
                $parent.remove();
                displayNotification();
            }, 295);
        })

    })

})

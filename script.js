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
    $("#taskAdd").on("click", function(){
        // console.log($tasksList);
        // console.log($tasksInput.val());
        if(!$tasksInput.val()) {return false;}

        // array.push($tasksInput.val());
        array.push({status: false,val: $tasksInput.val()});
        console.log(array);

        $tasksList.append("<li class='list-group-item'><input type='checkbox'/>" + $tasksInput.val() + "<button id='delete' class='delete btn btn-danger'>x</button></li>")

        $tasksInput.val("");

        displayNotification();

        $(":checkbox").change(function(){
            var $parent = $(this).parent();
            if(this.checked) {
                $parent.css("text-decoration", "line-through");
                // const arrid = array.element.id;
                // array.forEach(element => {
                //     if(element.id == arrid) {
                //         element.status = true;
                //     }
                //     console.log(element.status);
                // });
            } else {
                $parent.css("text-decoration", "none");
            }
        })

        $(".delete").on("click", function(){
            var $parent = $(this).parent();
            console.log($parent);
            $parent.css("display", "none");
        })

        setTimeout(function(){
            $parent.remove();
            displayNotification();
        }, 295);
    })
})

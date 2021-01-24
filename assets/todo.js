/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 */

/* Some info
Using newer versions of jQuery and jQuery UI in place of the links given in problem statement
All data is stored in local storage
User data is extracted from local storage and saved in variable todo.data
Otherwise, comments are provided at appropriate places
*/

/* Một số thông tin
Sử dụng các phiên bản mới hơn của jQuery và jQuery UI thay cho các liên kết được đưa ra trong câu lệnh vấn đề
Tất cả dữ liệu được lưu trữ trong bộ nhớ cục bộ
Dữ liệu người dùng được trích xuất từ ​​bộ nhớ cục bộ và được lưu trong biến todo.data
Nếu không, nhận xét được cung cấp ở những nơi thích hợp
*/


var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData")); // dọi dữ liệu từ biến cục bộ

data = data || {};

(function(todo, data, $) {


    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
            todoDate: "task-date",
            todoDescription: "task-description",
            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        },
        codes = {
            "1": "#pending",
            "2": "#inProgress",
            "3": "#completed"
        };

    todo.init = function(options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function(index, params) {
            generateElement(params);
        });

        /*generateElement({
            id: "123",
            code: "1",
            title: "asd",
            date: "22/12/2013",
            description: "Blah Blah"
        });*/

        /*removeElement({
            id: "123",
            code: "1",
            title: "asd",
            date: "22/12/2013",
            description: "Blah Blah"
        });*/

        // Adding drop function to each category of task
        // Thêm chức năng thả vào từng danh mục nhiệm vụ
        $.each(codes, function(index, value) {
            $(value).droppable({
                drop: function(event, ui) {
                    var element = ui.helper,
                        css_id = element.attr("id"),
                        id = css_id.replace(options.taskId, ""),
                        object = data[id];

                    // Removing old element
                    // Xóa phần tử cũ
                    removeElement(object);

                    // Changing object code
                    // Thay đổi mã đối tượng
                    object.code = index;

                    // Generating new element
                    // Tạo phần tử mới
                    generateElement(object);

                    // Updating Local Storage
                    // Cập nhật bộ nhớ cục bộ
                    data[id] = object;
                    localStorage.setItem("todoData", JSON.stringify(data));

                    // Hiding Delete Area                            
                    // Ẩn vùng xóa
                    $("#" + defaults.deleteDiv).hide();
                }
            });
        });

        // Adding drop function to delete div
        // Thêm chức năng thả để xóa div
        $("#" + options.deleteDiv).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];

                // Removing old element
                // Xóa phần tử cũ
                removeElement(object);

                // Updating local storage
                // Cập nhật bộ nhớ cục bộ
                delete data[id];
                localStorage.setItem("todoData", JSON.stringify(data));

                // Hiding Delete Area
                // Ẩn vùng xóa
                $("#" + defaults.deleteDiv).hide();
            }
        })

    };

    // Add Task
    // Thêm Task
    var generateElement = function(params) {
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class": defaults.todoTask,
            "id": defaults.taskId + params.id,
            "data": params.id
        }).appendTo(parent);

        $("<div />", {
            "class": defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);

        $("<div />", {
            "class": defaults.todoDate,
            "text": params.date
        }).appendTo(wrapper);

        $("<div />", {
            "class": defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper);

        wrapper.draggable({
            start: function() {
                $("#" + defaults.deleteDiv).show();
            },
            stop: function() {
                $("#" + defaults.deleteDiv).hide();
            },
            revert: "invalid",
            revertDuration: 200
        });



        $(document).ready(function() {

            // đánh dấu tác vụ quá hạn
            $($(".todo-task").children()).each(function(index, element) {
                if ($(this).hasClass("task-date")) {
                    var d1 = new Date().getTime();

                    var date = $(this).text();
                    var ngay = date.slice(0, 2);
                    var thang = date.slice(3, 5);
                    var nam = date.slice(6, 20);
                    var z = nam + "-" + thang + "-" + ngay;
                    var d2 = Date.parse(z);

                    if (d2 < d1) {
                        $(this).parent().addClass("yello");
                    }
                }
            });

            // tooltip nội dung khi click vào <div> todo-task
            $(".todo-task").click(function(e) {
                $(this).attr("data-toggle", "tooltip");
                $(this).attr("data-placement", "auto");
                $(this).attr("trigger", "focus");
                var noidung = $(this).find(".task-description").text();
                $(this).attr("title", "" + noidung + "");
                $('[data-toggle="tooltip"]').tooltip();

            });

        });

    };

    // Remove task
    // Xóa tác vụ
    var removeElement = function(params) {
        $("#" + defaults.taskId + params.id).remove();

    };

    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, tempData;

        if (inputs.length !== 4) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id: id,
            code: "1",
            title: title,
            date: date,
            description: description
        };

        // Saving element in local storage
        // Lưu biến dữ liệu trong bộ nhớ cục bộ
        data[id] = tempData;
        localStorage.setItem("todoData", JSON.stringify(data));

        // Generate Todo Element  
        // Tạo phần tử Todo
        generateElement(tempData);

        // Reset Form
        // Đặt lại biểu mẫu 
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
    };

    var generateDialog = function(message) {
        var responseId = "response-dialog",
            title = "Messaage",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                title: title,
                id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok": function() {
                responseDialog.dialog("close");
            }
        };

        responseDialog.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todo.clear = function() {
        data = {};
        localStorage.setItem("todoData", JSON.stringify(data));
        $("." + defaults.todoTask).remove();
    };

})(todo, data, jQuery);
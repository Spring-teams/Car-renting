$(document).ready(function(){
    var car= new Car();
    var islogin=$(".get-customer-info").attr("id")!="0";

    $(".header").on("click","li",function(){
        if($(this).attr("class")!="account" && $(".get-customer-info").attr("id")!="0"){

            window.location.href="/"+$(this).attr("class");

        }
        if($(".get-customer-info").attr("id")=="0"&& $(this).attr("id")!="home-container"){
            window.location.href="/login";
            return;
        }


    })
    $(".menu-content").on("click",".filter",function(){

        if($(this).hasClass("color-button")){
            $(this).removeClass("color-button");
        }
        else{
            $('.filter').removeClass("color-button");
            $(this).addClass("color-button");
        }
    });

    $(".menu-content").on("click","#find-button",function () {

        var seatNumber=$(".color-button").attr('id');
        if(seatNumber==null){
            car.loadAllToView();
            return;
        }
        var branch=$("select option:selected ").html();
        car.filterCar(seatNumber,branch);

    });
    $(".wrapper").on("click",".let-rent",function(){
        if(!islogin){
            window.location.href="/login";
            return ;
        }
        var parent=$(this).parent();
        var carId=parent.find(".carId").attr('name');
        window.open('/getSubmitForm?carid='+carId+"&customerid="+$(".get-customer-info").attr("id"));

    });

    doHistory();


});

function Car(){
    this.loadAllToView();
};
Car.prototype={
    constructor: Car,
    getAllCar: function () {
        var data={};
        $.ajax({
            url: "api/getallcar",
            type: "GET",
            dataType: "json",
            async: false,
            success: function(res){
                data=res;

            },
            error: function(){
                alert("Lỗi từ client");
            }
        });
        return data;
    },
    getWrapper: function(item){
        var wrapper=$("<div class=\"wrapper\">\n" +
            "                <div class=\"car-image "+item.carID+"\"></div>\n" +
            "                <div class=\"car-content\">\n" +
            "                    <div class=\"car-header\">\n" +
            "                        <div class=\"car-name\">"+item.carName+"</div>\n" +
            "                        <div class=\"car-price\">"+formatNumber(parseInt(item.price))+" VND"+"</div>\n" +
            "                    </div>\n" +
            "                    <hr>\n" +
            "                    <div class=\"car-info\">\n" +
            "                        <div class=\"car-branch\">\n" +
            "                            <i class=\"icon\"></i>\n" +
            "                            Nhãn hiệu:"+item.branch+"\n" +
            "                        </div>\n" +
            "                        <div class=\"setting\">\n" +
            "                            <i class=\"icon\"></i>\n" +
            "                            Hộp số: Tự động\n" +
            "                        </div>\n" +
            "                        <div class='number-seat'><i class='icon'></i> Số ghế: " + item.numberSeat+" chỗ</div>\n" +
            "                        <div class=\"owner\" name="+item.carID+">\n" +
            "                            <i class=\"icon\"></i>\n" +
            "                            Chủ xe: " + item.ownerName+"\n"+
            "                        </div>\n" +

            "                        <div class=\"battery\">\n" +
            "                            <i class=\"icon\"></i>\n" +
            "                            Tiêu hao: 5 L/100km\n" +
            "                        </div>\n" +
            "                        <div class=\"ventor\">\n" +
            "                            <i class=\"icon\"></i>\n" +
            "                            Máy lạnh: có\n" +
            "                        </div>\n" +


            "                        <div class=\"carId\" name="+item.carID+">\n" +
            "                            <i class=\"icon\"></i>\n" +
            "                            Biển số: " + item.carID+"\n"+
            "                        </div>\n" +
            "                        <div class=\"limit\">\n" +
            "                            <i class=\"icon\"></i>\n" +
            "                            Giới hạn: 250 km/ngày\n" +
            "                        </div>\n" +
            "                        <div class='category'><i class='icon'></i>Loại xe: " +item.categoryName +"</div>\n" +
            "\n" +
            "                    </div>\n" +
            "                        <button class=\"let-rent\">Thuê Ngay</button>\n" +
            "                </div>\n" +
            "\n" +
            "            </div>");

        return wrapper;
    },
    loadAllToView: function(){
        var data = this.getAllCar();
        var me=this;
        var main_content=$(".main-content");
        main_content.empty();
        $.each(data,function(index,item){
            main_content.append(me.getWrapper(item));
            var b=".car-image."+item.carID;
            var name="url('../images/"+item.image+".png')";
            $(b).css("background-image",name);


        });
    },
    filterCar: function(numberSeat,branch){
        var me=this;

        var data=this.getAllCar();
        var main_content=$(".main-content");
        main_content.empty();

        $.each(data,function(index,item){
            if(item.numberSeat==numberSeat && (item.branch==branch || branch=="Tất cả hãng xe")){
                main_content.append(me.getWrapper(item));
                var b=".car-image."+item.carID;
                var name="url('../images/"+item.image+".png')";
                $(b).css("background-image",name);

            }
        })

    }
}
function getRentalInfor(){
    var customerId=$(".get-customer-info").attr("id");

    var data={};
    $.ajax({
        url: "api/getrental/"+customerId,
        type:"GET",
        dataType: "json",
        async: false,
        success: function (res) {
            data=res['rentals'];
        },
        error: function(res){
            alert("Lỗi lấy mã đơn thuê!");
        }
    });
    return data;
}
function doHistory() {
    var data=getRentalInfor();
    if(data=="no"){
        return ;
    }
    $.each(data,function(index,item){
        var divTag=$("        <div class=\"rent-info-wrapper\">\n" +
            "            <div>Mã hóa đơn: " + item.rentalId +"</div>\n" +
            "            <div>Mã chủ xe: "+item.ownerId+" </div>\n" +
            "            <div>Ngày bắt đầu: "+item.beginDate+" </div>\n" +
            "            <div>Ngày trả xe: "+item.endDate+"</div>\n" +
            "            <div>Tổng số tiền: "+ formatNumber(item.totalMoney)+"</div>\n" +
            "            <div>Đã thanh toán: "+item.isPay+"</div>\n" +
            "            <div>Biển số xe: "+item.carId+"</div>\n" +
            "            <div>Tên chủ xe: "+item.ownerName+"</div>\n" +
            "            <div></div>\n" +
            "        </div>");
        $(".history-container").append(divTag);
    });
}
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
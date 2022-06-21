var loading = false;
let code_kind; // 엑셀로 변환할 때 써야해서 전역변수 처리 해줌.
let start_year;
let end_year;
let code_key; 

let standards = []; // 이건 연도 저장
let label = []; // 이건 국가명 or 장르명
let cnt_list; // 이건 이제 영화 수 저장할 배열

let first_time = true;


$( window ).ready(function() {
	//선택했을 때 불필요한 체크박스 비활성화 시키기.
	$('#set-standard').click(function () {
		var radioVal = $('input[name="standard"]:checked').val();
		
		if (radioVal == 'N') 
		{
			$("#sel_genre").css('display', 'none');
		 
		 	$('#sel_country').css('display', 'block');
		}
		else if (radioVal == 'G'){
			$("#sel_country").css('display', 'none');
		 
		 	$('#sel_genre').css('display', 'block');
		}
	
	});

	// 그래프 출력 버튼 클릭시 이벤트
	$("#display").click(function () {
		
		code_key = "(";
		standards = [];
		label = [];
		cnt_list = [];
		 
	    // 0. 그래프 유형 선으로 초기화
	    $("input[name='chart']:checked").checked = false;  
	    document.getElementById('chart_line').checked = true;
	
	    // 1. 로딩화면 띄우기.
	    showLayer();  
	  
	    // 2.선택 옵션 정리 [시작년도, 끝년도, 분류kind, 분류key list]
	    start_year = document.getElementById('start').value;
	    end_year = document.getElementById('end').value;
	
	    if(end_year==0 || start_year == 0) { 
	        alert('기간에 공백이 있습니다.');
	        close();
	        return;
	    }
	    if (end_year <= start_year) {
	        alert('연도는 과거부터 입력해주세요. (최소 1년 차이)');
	        close();
	        return;
	    }
	  
	    code_kind = document.querySelector('input[name="standard"]:checked').value; // 체크된 값(checked value)	
	
	    if(code_kind == "N") {
	        const checkboxes = document.querySelectorAll('input[name="country"]'); 
	        checkboxes.forEach((checkbox) => {
	            if(checkbox.checked){
	             	code_key += checkbox.value + ",";
	            }
	        })
	    }
	    else if (code_kind == "G") {
	        const checkboxes = document.querySelectorAll('input[name="genre"]');
	
	        checkboxes.forEach((checkbox) => {
	            if(checkbox.checked){
	             	code_key += checkbox.value + ",";
	            }
	        })
	    }
	    
	    // 범주 0개 선택 점검
	    if(code_key == "(") {
	        alert('조회할 조건을 선택해주세요.');
	        close();
	        return;
	
	    }
	    else {
	    	code_key = code_key.slice(0, -1);
			code_key += ")";
	    } 
	 
	    
	    // 3. (원 그래프) 가져온 연도들 화면에 버튼으로 띄우기.
		let year_cnt = end_year - start_year + 1;
	 
		$('#years').empty();
		var innerHtml2 = ""; 
		
		for (var j = 0; j < year_cnt ; j++) {
	 		innerHtml2 += '<input type="radio" name="pie_year" id="chart_pie' + j  + '" value="' + j + '" >';
	 		innerHtml2 += '<label class="chart_pie_label" for="chart_pie' + j  +'">' +   ( Number(start_year) + Number(j)) + ' </label> ';
	
		}
		$('#years').append(innerHtml2);
	
	 		
	    // 5. controller 호출
	    var url = "/mvc/getChartValue";
		var param = {};
		
		param.startYear = start_year;
		param.endYear = end_year;
		param.codeKind = code_kind;
		param.codeKey = code_key;
		
	  
	 	for (var i = 0; i < year_cnt ; i++) {
	 		standards[i] = Number(start_year) + Number(i);
	 	}
	
		$.ajax({
			url: url,
			type : 'POST',
			dataType:'json',
			data : JSON.stringify(param),	
			contentType: 'application/json',
			success : function(data){
				// 가져온 그래프 데이터 처리.
				let k =0 ;
				var result = data.chartValue;
				
				cnt_list = new Array(result.length / year_cnt); // 국가 수 + 전체 개수로 들어감.
			 	for (var i = 0; i < cnt_list.length; i++) {
			 		cnt_list[i] = new Array(year_cnt);
			 		
				    for (let j = 0; j < year_cnt; j++) {
				    	cnt_list[i][j] = 0; // 0으로 초기화      
				    }
			  	}
		
				for(var i=0; i<result.length / year_cnt; i++){ // 국가별
					label[i] = result[i * year_cnt].codeKey;
					
					for(var j=0; j< year_cnt;j++){ // 연도별
						k = i * year_cnt + j;
	 					cnt_list[i][j] = result[k].count;
					}		
				}
				codeToName();
			},
			error : function(data){
				console.log("ajax POST 실패");
			}
		});
	 })
});


 
 
function codeToName() {
	// label 값 다시 한글로 바꾸기.
 	var url2 = "/mvc/codeToName";
	var param2 = {};
	param2.label = code_key;
	param2.code_kind = code_kind;
				
	$.ajax({
		url: url2,
		type : 'POST',
		dataType:'json',
		data : JSON.stringify(param2), // 코드로 이루어진 label 목록 전달.
		contentType: 'application/json',
		success : function(data){
 			var result = data.nameList;
			label = result;

		},
		error : function(data){
			console.log("ajax codeToName 실패");
		},
		complete : function(data) {
			// 처리가 완료 된 후 그래프 그리기.
			// 이때 데이터들은 전역변수에 저장했기 때문에 인자 전달할 필요 x
			draw_line(); 
		}
	});  
}

// 체크박스 라디오 박스 등 세부 사항 구현.

// 국가에서 전체 누르면 다 체크 되고 나머지 누르면 전체 해제하기.
function selectAll1(selectAll)  {
    const checkboxes 
        = document.querySelectorAll('input[name="country"]');
    
    checkboxes.forEach((checkbox) => {
        checkbox.set
        checkbox.checked = selectAll.checked
    })
} 

// 장르에서 전체 누르면 다 체크 되고 나머지 누르면 전체 해제하기.
function selectAll2(selectAll)  {
    const checkboxes 
        = document.querySelectorAll('input[name="genre"]');
    
    checkboxes.forEach((checkbox) => {
        checkbox.set
        checkbox.checked = selectAll.checked
    })
} 

// 이제 다른거 누르면 전체 선택이 해제 되기. & 다 선택되면 전체도 체크되게 하기.
function check1()  {
	var selAll = document.getElementById('coun_all');
    const checkboxes  = document.querySelectorAll('input[name="country"]');
    
    selAll.checked = true; 

    checkboxes.forEach((checkbox) => {
        if(!checkbox.checked) {
            selAll.checked = checkbox.checked;
        }
    })
} 
 

// 이제 다른거 누르면 전체 선택이 해제 되기. & 다 선택되면 전체도 체크되게 하기.
function check2()  {
	var selAll2 = document.getElementById('gen_all');
    const checkboxes  = document.querySelectorAll('input[name="genre"]');
    
    selAll2.checked = true; 

    checkboxes.forEach((checkbox) => {
        if(!checkbox.checked) {
            selAll2.checked = checkbox.checked;
        }
    })
}

// (로딩 화면) 화면의 중앙에 레이어띄움 
function showLayer() { 
    loading = true;
    wrapWindowByMask(); 
    var top = $('#fade').height()/2 - 100;
    var left = $('#fade').width()/2 - 100;

    document.getElementById('light').style.marginTop = top + 'px';
    document.getElementById('light').style.marginLeft = left + 'px';
    $('#fade').show();  
} 

function wrapWindowByMask() { //화면의 높이와 너비를 구한다. 
    $('#fade').css({ 'width': $('#result_chart').width(), 'height': $('#result_chart').height()}); 
}


function close() { 
    loading = false;
    $('#fade').hide(); 
}


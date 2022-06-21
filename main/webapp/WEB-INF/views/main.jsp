<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>영화 API 차트</title>

<link rel="stylesheet" type="text/css" href="/mvc/resources/css/myStyle.css">
<link rel="stylesheet" type="text/css" href="/mvc/resources/css/yearpicker.css"> 

<script type="text/javascript" src="resources/js/jquery/jquery-3.0.0.min.js"></script>
<script type="text/javascript" src="resources/js/jquery/jquery-ui.min.js"></script>  
 
<script type="text/javascript" src="resources/js/export.js"></script>
<script type="text/javascript" src="resources/js/handle_option.js"></script> 
<script type="text/javascript" src="resources/js/draw_graph.js"></script>  
<script type="text/javascript" src="resources/js/draw_pie.js"></script>  
<script type="text/javascript" src="resources/js/yearpicker.js"></script>
<script type="text/javascript" src="resources/js/html2canvas.js"></script>  
 
 
<!-- chart -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/gh/emn178/chartjs-plugin-labels/src/chartjs-plugin-labels.js"></script>
 -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.bundle.min.js"></script>
 -->
 <script src="https://cdn.jsdelivr.net/npm/chart.js@3.0.0/dist/chart.min.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.3.2/chart.min.js"></script>

<!-- save as file -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.3/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>
		   

<script type="text/javascript"> 
var nationList;
var genreList;
var patchTime;

$( window ).ready(function() {
	
 	nationList = ${nationList};
 	genreList = ${genreList};
 	patchTime = '${patchTime}';

 	// insert list
	var innerHtml = "";

	innerHtml += '<input type="checkbox" name="countryAll" id="coun_all" onclick="selectAll1(this)" >';
	innerHtml += '<label for="coun_all">전체 </label> ';
	for(var i=0; i<nationList.length;i++){
		if(nationList[i]._option_NM != "전체") {
			innerHtml +=" <input type='checkbox' name='country' id='coun_" + nationList[i]._option_CD   + "' value = " + nationList[i]._option_CD   + " onclick='check1()'>";
	 		innerHtml += '<label for="coun_' + nationList[i]._option_CD +'">' +  nationList[i]._option_NM  + ' </label> ';
		}
	}
	$('#sel_country').append(innerHtml);
	
 	innerHtml = "";
 	innerHtml += '<input type="checkbox" name="genreAll" id="gen_all" onclick="selectAll2(this)" >' 
	innerHtml += '<label for="gen_all">전체 </label> ';
	for(var i=0; i<genreList.length;i++){
		if(i==6) {
			innerHtml += "<br>";
		}
		if(genreList[i]._option_NM != "전체") {
			innerHtml +=" <input type='checkbox' name='genre' id='gen_" + genreList[i]._option_CD + "' value = " + genreList[i]._option_CD + " onclick='check2()'>"; 
	 		innerHtml += '<label for="gen_' + genreList[i]._option_CD +'">' +   genreList[i]._option_NM  + ' </label> ';
		
		}
	} 
	$('#sel_genre').append(innerHtml);  
	
	$('#patchTime').append(patchTime.slice(0,16)); 
	
});


</script>
 
</head>
<body>
   	 <header> 
   	 	<p id="patchTime">최근 동기화 시간 : </p>
   	 </header>

    <div id="container">
        <div id="content">

<!--             <p style="font-size: 13px;">OPEN API 활용</p> -->            <h1>연도별 영화 통계</h1>

            <div id="setting">
            
            	<!-- 연도 선택 div -->
                <div id="set-range">
                    <div class='set-years' style="float: left;">
                        <p>시작 연도</p>
                        <div class="year_div">
                            <div style="display: inline-block;">
                                <input type="text" autocomplete="off" class="yearpicker  a" id='start'>
                            </div>
                        </div>
                    </div>
                    ~
                    <div class='set-years' style="float: right;">
                        <p> 종료 연도</p>
                        <div class="year_div">
                            <div style="display: inline-block;">
                                <input type="text" autocomplete="off" class="yearpicker  b" id="end">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 기준 선택 div -->
                <div id="set-standard" style="border-top: solid 2px wheat; padding: 25px 0px 10px 0px;">
                    <input type="radio" name="standard" id="std_country" value="N" checked>
                    <label class="label-r" for="std_country">국가별 </label>

                    <input type="radio" name="standard" id="std_genre" value="G">
                    <label class="label-r" for="std_genre">장르별</label>

                </div>

                <!-- 범주 선택 div -->
                <div id='sel_country' style="line-height:200%; padding-top: 10px;"> </div>
                <div id='sel_genre' style="line-height:200%; padding-top: 10px; display:none "> </div>

            </div>
        </div>

        <button class="btn" id="display">그래프 출력</button>
        <div id="result">
            <div id="loading"></div>
			
			<fieldset>
                <img src="resources/img/common/line_yellow.png" class="icon" id="chart_line" value="line"  onclick="shape(this)"> 
                <img src="resources/img/common/pie_yellow.png" class="icon" id="chart_pie" value="0"   onclick="shape(this)">
                <img src="resources/img/common/bar_yellow.png" class="icon" id="chart_bar" value="bar" onclick="shape(this)"> 
            </fieldset>

			<div id="years" style="display:none;">
            </div>

            <div id="result_chart">
                <div id="fade" class="black_background">
                    <div id="light" class="loadingio-spinner-wedges-ynx2h61thk">
                        <div class="ldio-2hgux1lg16z">
                            <div>
                                <div>
                                    <div></div>
                                </div>
                                <div>
                                    <div></div>
                                </div>
                                <div>
                                    <div></div>
                                </div>
                                <div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="chart_div" style="width:100; height : 100;">
                    <canvas id="line-chart" width="100" height="100"></canvas>
                </div>
            </div>


            <div class="btns">
                <button class="btn" id="save_image">.png로 저장</button>
                <button class="btn" id="save_xlsx">.xlsx로 저장</button>
            </div>
        </div>


    </div>


</body>
</html>
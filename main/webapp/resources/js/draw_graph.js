let myChart;
let my_datasets;
let reverse;
let isCDL = false;

let color_list = [ '#D32F2F', '#FF9800', '#00796B', '#303F9F', '#B3242D', '#512DA8', '#5D4037', '#616161', '#FF4081', '#03A9F4'];
let color_list_a = [  '#D32F2F55', '#FF980055', '#00796B55', '#303F9F55', '#B3242D55', '#512DA855', '#5D403755', '#61616155', '#FF408155', '#03A9F455'];

$( window ).ready(function() {
	// 파이 차트 연도 변경
	$('#years').click(function () {
		var radioVal = $('input[name="pie_year"]:checked').val();
		draw_pie(radioVal);
	  
	});
});

function draw_line() {
	
	if (first_time) {
	      first_time = false;
	    }
    else {
		// 이미 차트가 그려져있었으면 destory 필요
    	myChart.destroy();
    }
	
	if(!isCDL) {
		Chart.register(ChartDataLabels); 
		isCDL = true; 
	}
    close(); // 로딩 화면

    my_datasets = [];
    for (let i = 0; i < label.length; i++) { 
    	// 전체 항목 추가해야함.
        my_datasets[i] = {
          label: label[i],
          data: cnt_list[i],
          borderColor: color_list[i],
          borderWidth: '3',
          backgroundColor: color_list[i],
          hoverBackgroundColor: 'white',
          pointHoverRadius: 10,
          pointRadius: 10,
          pointBorderWidth : 3,
          tension: 0.3, 
          datalabels: {
        	align: function(context) { 
              return 'center';
            } 
          }
        }
     }
 
    myChart = new Chart(document.getElementById('line-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels: standards,
            datasets: my_datasets
        },
        options: {
            plugins: {
                datalabels: { 
                    backgroundColor: function (context) {
                        //return context.active ? '#00000000' : 'white';
                        return 'white';
                     },
                    borderColor: function (context) {
                        return context.dataset.backgroundColor;
                    },
                    borderRadius: function (context) {
                     	return 32;
                    },
                    borderWidth: function (context) {
//                        return context.active ? 0 : 3;
                        return   3;
                     },
                    color: function (context) {
                     	return context.dataset.backgroundColor;
                    },
                    font: {
                        weight: 'bold'
                    },
                    formatter: function (value, context) {
                        value = Math.round(value * 100) / 100;
                        return  Math.round(value);
                     },
                    offset: 8,
                    padding: 5,
                    textAlign: 'center'
                 },
                title: {
                    display: true,
                    text: '영화 분류 결과'
                },
                responsive: true,
                tooltip: {
                    enabled: true,
                    position: 'nearest',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    callbacks: {
                        title: function (context) {
                            return;
                        }
                    },
                    mode: 'point',
					intersect: true,
                },
            }
        },
        aspectRatio: 5 / 3,
        layout: {
            padding: 20
        }
    });
}


function draw_bar() {
	if (first_time) {
	      first_time = false;
	    } else {
	      myChart.destroy();
	    }
	
	if(!isCDL) {
		Chart.register(ChartDataLabels); 
		isCDL = true; 
	}
	 
    close();

    my_datasets = [];
    let percent =[];
    let total_cnt = []; //선택한 항목들의 연도별 총 합.
  
//    연도별 총합 구하기.
   for (var i = 0; i <  end_year - start_year +1; i++) {
       total_cnt[i] = 0;
      for (let j = 0; j < label.length; j++) {
           total_cnt[i] += cnt_list[j][i];
      }
  }

  // 퍼센트 구하기.
  for (var i = 0; i < label.length ; i++) {
      percent[i] = new Array(end_year - start_year +1);

      for (let j = 0; j < end_year - start_year +1; j++) {
          percent[i][j] = ( parseFloat(cnt_list[i][j]) /  parseFloat(total_cnt[j]) * 100).toFixed(2);       
      }
  }
     

	// Tooltip 위치 커스텀!! stacked 에서도 가운데에 뜸 ㅜㅜ
	Chart.Tooltip.positioners.custom = function (elements, position) { 
	   if (!elements.length) {
	       return false;
	   }
	  
	   return { 
	       x: elements[0].element.x,
	       y: elements[0].element.y + elements[0].element.height / 2
	   }
	}
	 
    // dataset 
    for (let i = 0; i < label.length; i++) {
    	my_datasets[i] = {
	        label: label[i],
	        data: cnt_list[i],
	        borderColor: color_list[i], 
	        backgroundColor: color_list[i],
/*	        hoverBackgroundColor: color_list[i], 이거 없으면 걍 좀 어두워짐 오버시에 */
	        footer : percent[i],
	        datalabels: {
                labels: {
                    name: {
                        align: 'bottom',
                        font: { size: 11 },
                        formatter: function (value, ctx) { 
                        	var percent = ctx.chart.data.datasets[ctx.datasetIndex].footer[ctx.dataIndex];
                        	return percent < 15 ? '' : ctx.chart.data.datasets[ctx.datasetIndex].label; 
                        }
                    },
                    value: {
                        align: 'bottom',
                        backgroundColor: function (ctx) { 
                        }, 
                        color: function (ctx) {
                        	return 'white'; 
                        },
                        formatter: function (value, ctx) { 
                        	var percent = ctx.chart.data.datasets[ctx.datasetIndex].footer[ctx.dataIndex];
                        	return percent + '%'; 

                        },
                        offset : function (ctx) {
                        	var percent = ctx.chart.data.datasets[ctx.datasetIndex].footer[ctx.dataIndex];
                        	return percent < 15 ? 0 : 25;  
                        },
                        padding: 4
                    }
                }
 
            }
     
    	}
    }
	  
    myChart = new Chart(document.getElementById('line-chart').getContext('2d'), {
	    type: 'bar',
	    data: {
	      labels: standards,
	      datasets: my_datasets
	    },
	    options: {
            plugins: {
                datalabels: {
                    color: 'white',
                    display: function (context) {
                        // up 15% only displayed
                        // return Number(context.dataset.footer[context.dataIndex]) > 15;
						return true;
                    },
                    font: {
                        weight: 'normal'
                    } 
                },
                tooltip: { 
                    position: 'nearest',
                }, 
            },
            /*// Core options
            layout: {
                padding: {
                    top: 24,
                    right: 16,
                    bottom: 0,
                    left: 8
                }
            },
            elements: {
                line: {
                    fill: false
                },
                point: {
                    hoverRadius: 7,
                    radius: 5
                }
            },*/
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }

        }
    }); 
}


function draw_pie(index) {
    
	if(isCDL) {
		Chart.unregister(ChartDataLabels);
		isCDL = false; 
	}
	
    if (first_time) {
        first_time = false; 	       
    } 
    else {
        myChart.destroy(); 
    }
	close();


    my_datasets = [];
    let percent =[];
    let total_cnt = []; //선택한 항목들의 연도별 총 합.

    // 배열 돌리기 다른 모형의 차트랑 데이터 배열이 달라짐.
    reverse = new Array( end_year - start_year + 1 );
    for (var i = 0; i < end_year - start_year + 1; i++) {
        reverse[i] = new Array(label.length);
        total_cnt[i] = 0;
        for (let j = 0; j < label.length; j++) {
            reverse[i][j] = cnt_list[j][i]; // cnt_list의 값 넣기.
            total_cnt[i] += cnt_list[j][i];
        }
    }

    // calculate percent
    for (var i = 0; i < end_year - start_year + 1; i++) {
        percent[i] = new Array(label.length);

        for (let j = 0; j < label.length; j++) {
            percent[i][j] = ( parseFloat(reverse[i][j]) /  parseFloat(total_cnt[i]) * 100).toFixed(2);       
        }
    }
   
    // 원 dataset 설정하기 
    for (let i = 0; i < end_year - start_year + 1 ; i++) {
        my_datasets[i] = {
            label: standards[i],
            data: reverse[i],
            borderWidth: '1',
            hoverOffset: 4,
            borderColor: color_list,
            backgroundColor: color_list,
            hoverBackgroundColor: color_list,
            footer: percent[i]
        }
    }

    var ctx = document.getElementById('line-chart');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: label,
            datasets: [my_datasets[index]]
        },
        options: {
	        plugins: {
	            tooltip: {
					callbacks: {
						afterLabel:function(tooltipItem) {
		                    return tooltipItem.dataset.footer[tooltipItem.datasetIndex];
		                }
                    }
                },
	        }
    	}
	});
}



// 그래프 모양 바뀔 때마다 바꿔주기
function shape(param) {
    if (first_time) {
        return;
    }  
    switch(param.id) {
        case 'chart_line':
        	$('#years').css("display","none"); 
            draw_line();
            break;
         
        case 'chart_pie':
        	$('#years').css("display","block"); 
        	if(param.value === undefined) {
				// 첫번째 라디오 선택시켜주기.
				$("#chart_pie0").prop("checked",true);
            	draw_pie(0);
        	}
        	else {
        		draw_pie(param.value);
        	}
          	break;

        case 'chart_bar':
        	$('#years').css("display","none");  
            draw_bar();
            break;
    }
}






  
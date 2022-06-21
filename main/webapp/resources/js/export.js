var standard; 

window.onload = function(){
	
// 전체가 마지막으로 들어가게 했음.
	var excelHandler = {
	    getExcelFileName : function(){
	        return start_year+'_'+end_year+'_'+standard+'.xlsx';
	    },
	    getSheetName : function(){
	        return start_year+'_'+end_year+'_'+standard+'.xlsx';
	    },
	    getExcelData : function(){
	      
	        let my_data = new Array(label.length+1);
	        for (let i=0; i<label.length+1; i++) {
	            my_data[i] = []; //2차원 배열 생성
	        }

	        for (let i=0; i<label.length+1; i++) {
	            if(i==0){
	                my_data[i].push(standard); // 유형 알려줌.
	                my_data[i] = my_data[i].concat(standards);
	            }
	            else if (i==1) {
	            	//전체 행 마지막에 넣을것.
	            }
	            else{
	                my_data[i-1].push(label[i-1]);
	                my_data[i-1] = my_data[i-1].concat(cnt_list[i-1]);
	            }
	        }
	        my_data[label.length].push(label[0]);
            my_data[label.length] = my_data[label.length].concat(cnt_list[0]);
            
	        return my_data;
	    },
	    getWorksheet : function(){
	        return XLSX.utils.aoa_to_sheet(this.getExcelData());
	    }
	}

	$("#save_xlsx").click( function() {
		
		  if(code_kind == "N") 
		  {
			  standard = "국가별";
		  }
		  else if(code_kind == "G") {
			  standard = "장르별";
		  }
		  
		console.log("save_xlsx");
	    exportExcel();
	})


	function exportExcel(){ 
	    // step 1. workbook 생성
	    var wb = XLSX.utils.book_new();

	    // step 2. 시트 만들기 
	    var newWorksheet = excelHandler.getWorksheet();
	    
	    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
	    XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

	    // step 4. 엑셀 파일 만들기 
	    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

	    // step 5. 엑셀 파일 내보내기 
	    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
	}
	 
	function s2ab(s) { 
	    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	    var view = new Uint8Array(buf);  //create uint8array as viewer
	    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
	    return buf;    
	}

	$("#save_image").click( function() {
		console.log("save image!!");
		  if(code_kind == "N") 
		  {
			  standard = "국가별";
		  }
		  else if(code_kind == "G") {
			  standard = "장르별";
		  }
		
	    html2canvas(document.querySelector("#result_chart")).then(canvas => {
	        var myImage = canvas.toDataURL();
			downloadURI(myImage, start_year+'_'+end_year+'_'+standard+'.png'); 

	    });

	}) 

	function downloadURI(uri, name){
		var link = document.createElement("a")
		link.download = name;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
	}
	
}


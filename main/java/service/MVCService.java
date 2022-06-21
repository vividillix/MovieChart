package com.sorzz.mvc.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Arrays;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sorzz.mvc.dao.MVDAO;
import com.sorzz.mvc.vo.MCMovie;
import com.sorzz.mvc.vo.MVOption;
import com.sorzz.mvc.vo.SELOption;

@Service
public class MVCService {

	@Autowired
	private MVDAO mvDao; 
	
	// page init info
 	public List<MVOption> getNationList() {
		return mvDao.getNationList();
	}
 	
 	public List<MVOption> getGenreList() {
 		return mvDao.getGenreList();
	}
 	 
 	public String getPatchTime() {
 		return mvDao.getPatchTime(); 
 	} 

 	
 	// data select
 	public List<MCMovie> getChartValue(SELOption option) {
 		return mvDao.getChartValue(option);
 	} 
 	
 	public List<String> codeToName(String param, String param2) {
 		return mvDao.codeToName(param, param2); 
 	}

 	
 	
 	
 	public void updateMovieCountDaily() throws SQLException {
 		System.out.println("updateMovieCountDaily");

 		// 시간
  		LocalDateTime now = LocalDateTime.now();
  		int year = now.getYear();
  		
 		System.out.println("입력할 연도 : " + year);

 	    mvDao.insertPatchTime(now); 
 	    
 	    
 	    // 영화 수 카운트
		gatheringMovieCount(year); 	
 	    
 		// 처음 초기화 할 때 쓰는 거.
// 		for(int i = 2000; i<=year; i++) {
// 			gatheringMovieCount(i);
// 		}
 	    
 	     
 	}
 	
	public void gatheringMovieCount(int year) throws SQLException {
		System.out.println("gatheringMovieCount("+ year +") ");  
		
		// 국가별 카운트
		String nationNm[] = {"한국","미국","영국","중국", "일본","러시아", "홍콩"};
 		int nationCNT[] = {0,0,0,0,0,0,0};
		int nationCD[] = {1,2,3,4,5,6,7};   
		
		String genreNm[] = {"드라마","코미디","범죄","다큐멘터리","애니메이션","멜로/로맨스","공포(호러)","액션","스릴러","SF"};
		int genreCNT[] = {0,0,0,0,0,0,0,0,0,0};
		int genreCD[] = {1,2,3,4,5,6,7,8,9,10};
	 
		// JSON
		HttpURLConnection conn = null;
	    JSONObject responseJson = null; 
	    JSONArray movieList;
	    
	    // 한번에 다 나오지 않아서, 페이지 별로 반복 돌면서 확인.
	    int curPg = 1;  
		int itemPerPage = 100;
    	int total_cnt = 0; 

	    do {
	    	try {
	    		
	    		URL url = new URL("http://www.kobis.or.kr/kobisopenapi/webservice/rest/"
		        		+ "movie/searchMovieList.json?key=f54e516db2166072c884a6cb9a989358"
		        		+ "&itemPerPage="+itemPerPage+"&curPage="+curPg + "&openStartDt="+year + "&openEndDt="+year);
	    		
	    		conn = (HttpURLConnection) url.openConnection(); 
		        conn.setRequestProperty("Content-Type", "application/json");
		 
		        int responseCode = conn.getResponseCode();
		        if (responseCode == 401) {
		            System.out.println("401:: Header瑜� �솗�씤�빐二쇱꽭�슂.");
		        } else if (responseCode == 500) {
		            System.out.println("500:: �꽌踰� �뿉�윭");
		        } else { // response
		            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		            StringBuilder sb = new StringBuilder();
		            String line = "";
		            while ((line = br.readLine()) != null) {
		                sb.append(line);
 		            }
 		            responseJson = new JSONObject(sb.toString());
		        }
		    } catch (MalformedURLException e) {
		        e.printStackTrace();
		    } catch (IOException e) {
		        e.printStackTrace();
		    } catch (JSONException e) {
		        System.out.println("not JSON Format response");
		        e.printStackTrace();
		    }
	    	
	    	 
	    	// 가져온 영화 정보 분석
		    movieList = responseJson.getJSONObject("movieListResult").getJSONArray("movieList");
		     
		    for (int i = 0; i < movieList.length(); i++) {
	            JSONObject data = movieList.getJSONObject(i); // data = �쁺�솕 1媛�
 	            
	            // 개봉한 영화만 취급
	            if(data.getString("prdtStatNm").equals("개봉")) {
	            	
	            	total_cnt++;
	            	
	            	// 국가,장르 각각 해당하는 리스트에 개수 추가 해줌.
		            if(Arrays.asList(nationNm).contains(data.getString("repNationNm"))) {
	 	            	nationCNT[Arrays.asList(nationNm).indexOf(data.getString("repNationNm"))]++;	            	
		            }
		            
		            if(Arrays.asList(genreNm).contains(data.getString("repGenreNm"))) {
	 	            	genreCNT[Arrays.asList(genreNm).indexOf(data.getString("repGenreNm"))]++;	            	
		            }
		             
	            }  
	        }
 
  		    curPg++;
	    	 
	    } while(movieList.length() == itemPerPage); 
 		MCMovie total_info = new MCMovie(year,"T",0,total_cnt);
 		
		// 해당 연도에 해당하는 정보 지우고, 새로 저장.
 		mvDao.deleteList(total_info);
	    mvDao.insertList(total_info);
	 
 	    // 영화 카운트 리스트 저장.
	    insertMovieList(year,"N",nationCD,nationCNT); 
	    insertMovieList(year,"G",genreCD,genreCNT); 
	}
	
	public void insertMovieList(int year, String code_kind, int[] codekeyList, int[] countList) {
		System.out.println("---- insertMovieList(" + code_kind + ") ----"); 
		
		MCMovie param = new MCMovie(year,code_kind,0,0);
		
		for (int i=0; i<codekeyList.length; i++) {
			param.setcodeKey(codekeyList[i]);
			param.setcount(countList[i]);
			
		    mvDao.insertList(param);
		}
	} 
		
	
}

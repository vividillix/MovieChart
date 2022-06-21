package com.sorzz.mvc.dao;

import java.time.LocalDateTime;
import java.util.List;

import com.sorzz.mvc.vo.MCMovie;
import com.sorzz.mvc.vo.MVOption;
import com.sorzz.mvc.vo.SELOption;

public interface MVDAO {
	
	public List<MVOption> getNationList();

	public List<MVOption> getGenreList();
	
 
	public void insertList(MCMovie param);

	public void deleteList(MCMovie param);

	//public List<MCMovie> selectMovieList(SELOption param);
	public List<MCMovie> selectMovieList(List<String> param);

	public List<MCMovie> getChartValue(SELOption option);

	public List<String> codeToName(String param, String param2);

	public String getPatchTime();

	public void insertPatchTime(LocalDateTime updateDate);
}

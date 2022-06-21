package com.sorzz.mvc.dao;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sorzz.mvc.vo.MCMovie;
import com.sorzz.mvc.vo.MVOption;
import com.sorzz.mvc.vo.SELOption;

@Repository
public class MVDAOImpl implements MVDAO{
	@Autowired
	private SqlSession sqlSession;
	private String mapper = "mapper.MVCMapper.";
	
	@Override
	public List<MVOption> getNationList() {
 		return sqlSession.selectList(mapper + "getNationList");
	}

	@Override
	public List<MVOption> getGenreList() {
		return sqlSession.selectList(mapper + "getGenreList");
	}

	@Override
	public void insertList(MCMovie param) {
 		sqlSession.insert(mapper + "insertMovieCount", param); 
	}

	@Override
	public void deleteList(MCMovie param) {
 		sqlSession.delete(mapper + "deleteMovieCount", param); 
	}
	 
	
	@Override
	public List<MCMovie> selectMovieList(List<String> param) { 
 		Map<String, Object> search_map = new HashMap<String, Object>();
		search_map.put("param", search_map);
		
		return sqlSession.selectList(mapper + "selectMovieList", search_map); 
	}

	@Override
	public List<MCMovie> getChartValue(SELOption option) {
 		Map<String, Object> search_map = new HashMap<String, Object>();
		search_map.put("codeKey", option.getcodeKey());
		search_map.put("start", option.getstartYear());
		search_map.put("end", option.getendYear());
		search_map.put("codeKind", option.getcodeKind());
		
		return sqlSession.selectList(mapper + "getChartValue", search_map); 
	}

	@Override
	public List<String> codeToName(String param, String param2) {
		Map<String, Object> search_map = new HashMap<String, Object>();
		search_map.put("keys", param);
		
		switch (param2) {
		case "N" :
			return sqlSession.selectList(mapper + "codeToNameN", search_map);  
 		case "G" :
			return sqlSession.selectList(mapper + "codeToNameG", search_map);  
 		}
		return sqlSession.selectList(mapper + "codeToNameN", search_map);  

	}

	@Override
	public String getPatchTime() {
		return sqlSession.selectOne(mapper + "getPatchTime");  

	}

	@Override
	public void insertPatchTime(LocalDateTime updateDate) {
 		sqlSession.insert(mapper + "insertPatchTime", Timestamp.valueOf(updateDate));   
	}
	 
}

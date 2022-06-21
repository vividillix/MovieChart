package com.sorzz.mvc.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sorzz.mvc.service.MVCService;
import com.sorzz.mvc.vo.MCMovie;
import com.sorzz.mvc.vo.MVOption;
import com.sorzz.mvc.vo.SELOption;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;


@Controller
public class MVCController {
	
	@Autowired
	private MVCService mvcService;
		 
	@RequestMapping(value = "/main", method = RequestMethod.GET)
	public String main(Locale locale, Model model) {
		
		List<MVOption> nationList = mvcService.getNationList();		 
		model.addAttribute("nationList", JSONSerializer.toJSON(nationList));
		
		List<MVOption> genreList = mvcService.getGenreList();
		model.addAttribute("genreList", JSONSerializer.toJSON(genreList)); 
		
		String patchTime = mvcService.getPatchTime();
		model.addAttribute("patchTime", patchTime); 

		return "main";
	}
	
	
	@RequestMapping(value = "/getChartValue", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> getChartValue(Model model, @RequestBody String param, HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> retData = new HashMap<String, Object>();
 	
		SELOption option = new SELOption();
		JSONObject jsonParam = JSONObject.fromObject(param);
 		
		if(jsonParam.has("startYear")) {
 			option.setstartYear(jsonParam.getInt("startYear"));
		}		
		if(jsonParam.has("endYear")) {
 			option.setendYear(jsonParam.getInt("endYear"));
		}	
		if(jsonParam.has("codeKind")) {
 			option.setcodeKind(jsonParam.getString("codeKind"));
		}			
		if(jsonParam.has("codeKey")) {
 			option.setcodeKey(jsonParam.getString("codeKey"));  
		}	
		
		List<MCMovie> chartValue = mvcService.getChartValue(option);
		
		retData.put("chartValue", JSONSerializer.toJSON(chartValue));

		return retData;
	}
	
	
	@RequestMapping(value = "/codeToName", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> codeToName(Model model, @RequestBody String param, HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> retData = new HashMap<String, Object>();
		JSONObject jsonParam = JSONObject.fromObject(param);
 	 
		List<String> nameList = mvcService.codeToName(jsonParam.getString("label"), jsonParam.getString("code_kind"));

		retData.put("nameList", JSONSerializer.toJSON(nameList)); 
		return retData;  
		
	} 
	
}

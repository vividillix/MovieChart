package com.sorzz.mvc.vo;

public class MVOption		 
 {
	
	//국가랑 장르 둘 다 가져올거임 이걸로..
	private Integer optionCD; // 코드
	private String optionNM; // 제목
	  
	public MVOption() {
		super();
	}
	
	public MVOption(int optionCD, String optionNM) {
		super();
		this.optionCD = optionCD;
		this.optionNM = optionNM;
 	}
	
	public int get_option_CD() {
		return optionCD;
	}
	  
	public String get_option_NM() {
		return optionNM;
	}
	   
}

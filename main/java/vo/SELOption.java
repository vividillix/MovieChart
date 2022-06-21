package com.sorzz.mvc.vo;

public class SELOption {
	private int startYear; // 개봉연도
	private int endYear; // 개봉연도
	private String codeKind; // 분류 기준
	private String codeKey; // 선택 범주 목록
   	

	public SELOption() {
		super();
	}
	
	public SELOption( int startYear, int endYear, String codeKind, String codeKey) {
		super();
		this.startYear = startYear;
		this.endYear = endYear;
		this.codeKind = codeKind;
		this.codeKey = codeKey; 
	}
	
	public int getstartYear() {
		return startYear;
	}
	public void setstartYear(int startYear) {
		this.startYear = startYear;
	}
		
	
	public int getendYear() {
		return endYear;
	}
	public void setendYear(int endYear) {
		this.endYear = endYear;
	}
	
	public String getcodeKind() {
		return codeKind;
	}
	public void setcodeKind(String codeKind) {
		this.codeKind = codeKind;
	}
	
	public String getcodeKey() {
		return codeKey;
	}
	public void setcodeKey(String codeKey) {
		this.codeKey = codeKey;
	}

}

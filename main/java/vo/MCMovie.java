package com.sorzz.mvc.vo;

public class MCMovie {
	private int openYear; // 개봉연도
	private String codeKind; // 코드 카인드
	private int codeKey; // 코드 키
	private int count; // 영화 수
   	

	public MCMovie() {
		super();
	}
	
	public MCMovie(int openYear,String codeKind,int codeKey,int count) {
		super();
		this.openYear = openYear;
		this.codeKind = codeKind;
		this.codeKey = codeKey;
		this.count = count; 
	}
	
	public int getopenYear() {
		return openYear;
	}
	public void setopenYear(int openYear) {
		this.openYear = openYear;
	}
	

	public String getcodeKind() {
		return codeKind;
	}
	public void setcodeKind(String codeKind) {
		this.codeKind = codeKind;
	}
	
	
	public int getcodeKey() {
		return codeKey;
	}
	public void setcodeKey(int codeKey) {
		this.codeKey = codeKey;
	}
	

	public int getcount() {
		return count;
	}
	public void setcount(int count) {
		this.count = count;
	}
	 
}

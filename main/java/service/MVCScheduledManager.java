package com.sorzz.mvc.service;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MVCScheduledManager {  
	@Autowired
	private MVCService mvcService; 
 
	public void updateMovieCountDaily() { 
		try {
			mvcService.updateMovieCountDaily();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
 	}  
}

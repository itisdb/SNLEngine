#pragma once

#ifndef SNL_PLATFORM_WINDOWS
    #define SNL_PLATFORM_WINDOWS // Define the macro if it's not already defined
#endif

#ifdef SNL_PLATFORM_WINDOWS
	#ifdef SNL_BUILD_DLL
		#define SNL_API __declspec(dllexport)
	#else
		#define SNL_API __declspec(dllimport)
	#endif
#else
	#error SNL only supports Windows!
#endif
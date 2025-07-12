#pragma once
#include <stdio.h>

#ifdef SNL_PLATFORM_WINDOWS

extern SNL::Application* SNL::CreateApplication();

int main(int argc, char** argv) {
	printf("Sandbox Application Starting...\n");
	auto sandbox = SNL::CreateApplication();
	sandbox->Run();
	delete sandbox;
	//wait for user input before closing
	printf("Press Enter to exit...\n");
}

#endif
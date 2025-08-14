#include "Application.h"
#include <iostream>
namespace SNL {
	Application::Application() {
		// Constructor implementation
	}
	Application::~Application() {
		// Destructor implementation
	}
	//this is the overrideable method that will be called to run the application
	void Application::Run() {
		// Run method implementation
		std::cout << "Application is running!" << std::endl;
	}
} // namespace SNL

// This is the main entry point for the application
SNL::Application* SNL::CreateApplication() {
	return new SNL::Application();
}
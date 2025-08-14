#include <iostream>  
#include <SNL.h>  

class SandboxApp : public SNL::Application {  
	public:  
	SandboxApp() {  
		// Constructor implementation  
	}  
	~SandboxApp() {  
		// Destructor implementation  
	}  
	void Run() override {  
		// Run method implementation  
		std::cout << "Sandbox Application is running!" << std::endl;  
	}  
};  

SNL::Application* SNL::CreateApplication() { 
	return new SandboxApp();  
}
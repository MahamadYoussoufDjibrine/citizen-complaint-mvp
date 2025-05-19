import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Search, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Making Government Services Work For You
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Submit complaints, track progress, and get timely resolutions from your local government.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link to="/submit">
                  <Button size="lg" variant="success" className="w-full sm:w-auto">
                    Submit a Complaint
                  </Button>
                </Link>
                <Link to="/track">
                  <Button size="lg" variant="outline" className="bg-white w-full sm:w-auto">
                    Track Existing Complaint
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Citizen and government collaboration" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies the process of submitting and resolving citizen complaints
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Submit Your Complaint</h3>
              <p className="text-gray-600">
                Fill out a simple form with details about your issue. You'll receive a unique tracking ID.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-teal-100 p-3 rounded-full mb-4">
                <Search className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Track Your Progress</h3>
              <p className="text-gray-600">
                Use your tracking ID to monitor the status of your complaint at any time.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Get Resolution</h3>
              <p className="text-gray-600">
                Receive updates and resolution confirmation directly from government staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Government Departments</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect your complaints to the right department for efficient resolution
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Roads & Infrastructure', icon: '🛣️', description: 'Potholes, road damage, bridges, and public infrastructure issues' },
              { name: 'Water Supply', icon: '💧', description: 'Water quality issues, supply interruptions, and leakages' },
              { name: 'Electricity', icon: '⚡', description: 'Power outages, electrical hazards, and street lighting problems' },
              { name: 'Sanitation & Waste', icon: '🗑️', description: 'Garbage collection, public cleanliness, and waste management' },
              { name: 'Public Safety', icon: '🚨', description: 'Traffic signals, street signage, and safety hazards' },
              { name: 'General Enquiries', icon: '❓', description: 'Any other municipal or government service complaints' },
            ].map((dept, index) => (
              <Card key={index} className="h-full transition-transform duration-300 hover:transform hover:scale-105">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <span className="text-4xl mb-3" aria-hidden="true">{dept.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{dept.name}</h3>
                  <p className="text-gray-600">{dept.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to be heard?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Your feedback helps improve government services for everyone.
            Submit your complaint today and be part of the solution.
          </p>
          <Link to="/submit">
            <Button size="lg" variant="success" className="px-8">
              Submit a Complaint Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
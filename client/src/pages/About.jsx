import React from 'react'
import {
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  Mail,
  Linkedin,
  Twitter
} from 'lucide-react'

const About = () => {
  const stats = [
    { label: 'Active Users', value: '50,000+', icon: Users },
    { label: 'Transactions Tracked', value: '2M+', icon: TrendingUp },
    { label: 'Money Saved', value: '₹500Cr+', icon: Target },
    { label: 'Countries', value: '15+', icon: Globe }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your financial data is protected with bank-level encryption and security measures.'
    },
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Every feature is designed with our users\' needs and feedback at the center.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously innovate to provide cutting-edge financial management tools.'
    },
    {
      icon: CheckCircle,
      title: 'Transparency',
      description: 'Clear, honest communication about our features, pricing, and data practices.'
    }
  ]

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      image: '/api/placeholder/150/150',
      bio: 'Former fintech executive with 15+ years of experience in financial services.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      image: '/api/placeholder/150/150',
      bio: 'Tech leader passionate about building scalable financial platforms.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Amit Patel',
      role: 'Head of Product',
      image: '/api/placeholder/150/150',
      bio: 'Product strategist focused on creating intuitive user experiences.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Design',
      image: '/api/placeholder/150/150',
      bio: 'Design expert creating beautiful and functional financial interfaces.',
      social: { linkedin: '#', twitter: '#' }
    }
  ]

  const milestones = [
    {
      year: '2023',
      title: 'Company Founded',
      description: 'SaveWise was founded with a mission to democratize personal finance management.'
    },
    {
      year: '2023',
      title: 'Beta Launch',
      description: 'Launched beta version with core budgeting and expense tracking features.'
    },
    {
      year: '2024',
      title: '10K Users',
      description: 'Reached 10,000 active users and launched advanced analytics features.'
    },
    {
      year: '2024',
      title: 'Series A Funding',
      description: 'Raised Series A funding to expand our team and accelerate product development.'
    },
    {
      year: '2025',
      title: '50K Users',
      description: 'Crossed 50,000 users and launched AI-powered financial insights.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About SaveWise</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            We're on a mission to make personal finance management simple, accessible, and empowering for everyone.
          </p>
          <div className="flex justify-center space-x-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon size={24} className="mr-2" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              At SaveWise, we believe that everyone deserves access to powerful financial tools that help them make 
              informed decisions about their money. We're building a platform that combines simplicity with 
              sophistication, making it easy for anyone to take control of their financial future.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simplify Finance</h3>
                <p className="text-gray-600">Make complex financial concepts accessible to everyone</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Empower Growth</h3>
                <p className="text-gray-600">Help users build wealth and achieve their financial goals</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drive Success</h3>
                <p className="text-gray-600">Provide tools and insights for financial success</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The passionate people behind SaveWise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href="mailto:team@savewise.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our growth story</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="text-blue-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl opacity-90 mb-8">
            Have questions or want to learn more about SaveWise? We'd love to hear from you.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <a
              href="mailto:hello@savewise.com"
              className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Mail size={20} />
              <span>hello@savewise.com</span>
            </a>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

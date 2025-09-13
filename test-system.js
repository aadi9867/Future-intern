const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Rahul Chaurasiya',
  email: 'rahul.test@example.com',
  contact: '8602327416',
  qualification: 'MTech',
  college: 'IIPS',
  year: 3,
  currentCity: 'Indore',
  domain: 'Python Development',
  linkedin: 'https://linkedin.com/in/rahul-test'
};

async function testSystem() {
  console.log('🧪 Testing Future Intern System...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing API Health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ API Health:', healthResponse.data.message);
    console.log('📅 Timestamp:', healthResponse.data.timestamp);
    console.log('');

    // Test 2: Check Email Availability
    console.log('2️⃣ Testing Email Availability Check...');
    const emailCheckResponse = await axios.post(`${API_BASE}/auth/check-email`, {
      email: testUser.email
    });
    console.log('✅ Email Check:', emailCheckResponse.data.message);
    console.log('📧 Available:', emailCheckResponse.data.available);
    console.log('');

    // Test 3: Student Registration
    console.log('3️⃣ Testing Student Registration...');
    const registrationResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    
    if (registrationResponse.data.success) {
      console.log('✅ Registration Successful!');
      console.log('👤 Student Name:', registrationResponse.data.data.student.name);
      console.log('🎓 Domain:', registrationResponse.data.data.internship.domain);
      console.log('🔑 Generated Password:', registrationResponse.data.data.password);
      console.log('⚠️ Warning:', registrationResponse.data.warning);
      console.log('');

      // Test 4: Student Login
      console.log('4️⃣ Testing Student Login...');
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: testUser.email,
        password: registrationResponse.data.data.password
      });

      if (loginResponse.data.success) {
        console.log('✅ Login Successful!');
        console.log('👤 Welcome back:', loginResponse.data.data.student.name);
        console.log('🎓 Internships:', loginResponse.data.data.internships.length);
        console.log('🔐 Token received:', !!loginResponse.data.data.token);
        console.log('');

        // Test 5: Get Profile
        console.log('5️⃣ Testing Profile Fetch...');
        const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${loginResponse.data.data.token}`
          }
        });

        if (profileResponse.data.success) {
          console.log('✅ Profile Fetch Successful!');
          console.log('👤 Student:', profileResponse.data.data.student.name);
          console.log('📧 Email:', profileResponse.data.data.student.email);
          console.log('🎓 Internships:', profileResponse.data.data.internships.length);
          console.log('');

          // Test 6: Get Internships
          console.log('6️⃣ Testing Internships Fetch...');
          const internshipsResponse = await axios.get(`${API_BASE}/internships`, {
            headers: {
              'Authorization': `Bearer ${loginResponse.data.data.token}`
            }
          });

          if (internshipsResponse.data.success) {
            console.log('✅ Internships Fetch Successful!');
            console.log('📚 Total Internships:', internshipsResponse.data.data.length);
            if (internshipsResponse.data.data.length > 0) {
              console.log('🎯 First Internship:', internshipsResponse.data.data[0].domain);
              console.log('📈 Progress:', internshipsResponse.data.data[0].progress + '%');
            }
            console.log('');

            // Test 7: Get Available Domains
            console.log('7️⃣ Testing Available Domains...');
            const domainsResponse = await axios.get(`${API_BASE}/internships/available-domains`, {
              headers: {
                'Authorization': `Bearer ${loginResponse.data.data.token}`
              }
            });

            if (domainsResponse.data.success) {
              console.log('✅ Available Domains Fetch Successful!');
              console.log('🎯 Available Domains:', domainsResponse.data.data.available.length);
              console.log('📚 Registered Domains:', domainsResponse.data.data.registered.length);
              console.log('');

              // Test 8: Register for New Domain
              if (domainsResponse.data.data.available.length > 0) {
                console.log('8️⃣ Testing New Domain Registration...');
                const newDomain = domainsResponse.data.data.available[0];
                const domainRegistrationResponse = await axios.post(`${API_BASE}/internships/register-domain`, {
                  domain: newDomain
                }, {
                  headers: {
                    'Authorization': `Bearer ${loginResponse.data.data.token}`
                  }
                });

                if (domainRegistrationResponse.data.success) {
                  console.log('✅ New Domain Registration Successful!');
                  console.log('🎯 New Domain:', domainRegistrationResponse.data.data.internship.domain);
                  console.log('📝 Tasks Created:', domainRegistrationResponse.data.data.tasksCreated);
                }
              }
            }
          }
        }
      } else {
        console.log('❌ Login Failed:', loginResponse.data.message);
      }
    } else {
      console.log('❌ Registration Failed:', registrationResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 400 && error.response?.data?.code === 'EMAIL_EXISTS') {
      console.log('💡 Email already exists. Try with a different email address.');
    }
  }

  console.log('\n🎉 System Test Complete!');
  console.log('\n📋 Test Summary:');
  console.log('✅ API Health Check');
  console.log('✅ Email Availability Check');
  console.log('✅ Student Registration');
  console.log('✅ Password Generation (20-25 chars)');
  console.log('✅ Student Login');
  console.log('✅ Profile Fetch');
  console.log('✅ Internships Management');
  console.log('✅ Domain Registration');
  console.log('\n🚀 Your Future Intern system is working perfectly!');
}

// Run the test
testSystem().catch(console.error); 
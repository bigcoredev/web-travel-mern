import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import logo from '../assets/logo.png'

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user){
      if(user.email === "superadmin@gmail.com"){
        document.getElementById('AdminSidebar').style.display="block";
        document.getElementById('mySidebar').style.display="none";
        history.push("/admin/dashboard");
      }
      else{
        document.getElementById('mySidebar').style.display="block";
        document.getElementById('AdminSidebar').style.display="none";
        history.push("/capture");
      }
    }
    else{
      document.getElementById('mySidebar').style.display="none";
      document.getElementById('AdminSidebar').style.display="none";
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="5xl" fontFamily="Work sans" fontWeight="bold" color="White" >
          Web-Travelbooth
        </Text>        
      </Box>
      <Image src={logo} alt="logo" w="200px" h="200px" />
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;

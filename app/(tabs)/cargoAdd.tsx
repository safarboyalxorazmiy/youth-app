import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import ArrowLeftIcon from "@/assets/images/navbar/ArrowLeftIcon.svg";
import { useRef, useState } from "react";
import { StatusBar } from "react-native";

export default function CargoAdd() {
  const [focusedInput, setFocusedInput] = useState<String>("");
  const [typeInputValue, setTypeInputValue] = useState<String>("");
  const [locationAInputValue, setLocationAInputValue] = useState<String>("");
  const [locationBInputValue, setLocationBInputValue] = useState<String>("");
  const [detailInputValue, setDetailInputValue] = useState<String>("");

  const scrollRef = useRef<ScrollView>(null);

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const scrollToStart = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF"}}>
      <View style={{height: 30, width: "100%"}}></View>
      
      <ScrollView ref={scrollRef}>
        <View style={{ paddingTop: 26, paddingBottom: 56 }}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, width: "100%"}}>
            <ArrowLeftIcon />

            <Text style={{fontSize: 22, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>Yuk qo’shish</Text>

            <View></View>
          </View>

          <View style={{paddingHorizontal: 38, marginTop: 50, width: "100%"}}>
            <View style={{width: "100%", borderColor: focusedInput == "LocationAInput" || locationAInputValue != "" ? "#000000" : "#ADADAD", borderRadius: 10, paddingHorizontal: 18, borderWidth: focusedInput == "LocationAInput" || locationAInputValue != "" ? 1.5 : 1, height: 55, position: "relative", alignItems: "center", justifyContent: "center"}}>
              {
                focusedInput == "LocationAInput" || locationAInputValue != "" ? (
                  <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text style={{color: "#000000"}}>dan</Text>
                  </View>
                ) : (<></>)
              }

              <Text style={focusedInput != "LocationAInput" && locationAInputValue == "" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>dan</Text>
              <TextInput 
                onPress={() => {
                  scrollToStart();
                }}
                style={{width: "100%", height: "100%", marginTop: "10%", fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular"}} 
                onChange={(e) => setLocationAInputValue(e.nativeEvent.text)} 
                onFocus={() => setFocusedInput("LocationAInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
              <Text style={{color: "#4F4F4F", fontSize: 18, fontFamily: "SfProDisplayRegular"}}></Text>
            </View>
          </View> 

          <View style={{paddingHorizontal: 38, marginTop: 22, width: "100%"}}>
            <View style={{width: "100%", borderColor: focusedInput == "LocationBInput" || locationBInputValue != "" ? "#000000" : "#ADADAD", borderRadius: 10, paddingHorizontal: 18, borderWidth: focusedInput == "LocationBInput" || locationBInputValue != "" ? 1.5 : 1, height: 55, position: "relative", alignItems: "center", justifyContent: "center"}}>
              {
                focusedInput == "LocationBInput" || locationBInputValue != "" ? (
                  <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text style={{color: "#000000"}}>ga</Text>
                  </View>
                ) : (<></>)
              }

              <Text style={focusedInput != "LocationBInput" && locationBInputValue == "" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>ga</Text>
              <TextInput 
                style={{width: "100%", height: "100%", marginTop: "10%", fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular"}} 
                onChange={(e) => setLocationBInputValue(e.nativeEvent.text)} 
                onFocus={() => setFocusedInput("LocationBInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
              <Text style={{color: "#4F4F4F", fontSize: 18, fontFamily: "SfProDisplayRegular"}}></Text>
            </View>
          </View> 

          <View style={{paddingHorizontal: 38, marginTop: 28, width: "100%"}}>
            <View style={{width: "100%", borderColor: focusedInput == "TypeInput" || typeInputValue != "" ? "#000000" : "#ADADAD", borderRadius: 10, paddingHorizontal: 18, borderWidth: focusedInput == "TypeInput" || typeInputValue != "" ? 1.5 : 1, height: 55, position: "relative", alignItems: "center", justifyContent: "center"}}>
              {
                focusedInput == "TypeInput" || typeInputValue != "" ? (
                  <View style={{position: "absolute", top: "-25%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text style={{color: "#000000"}}>Yuk moshinasi turi *</Text>
                  </View>
                ) : (<></>)
              }

              <Text style={focusedInput != "TypeInput" && typeInputValue == "" ? {position: "absolute", top: "25%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>Yuk moshinasi turi *</Text>
              <TextInput 
                style={{width: "100%", height: "100%", marginTop: "10%", fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular"}} 
                onChange={(e) => setTypeInputValue(e.nativeEvent.text)} 
                onFocus={() => setFocusedInput("TypeInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
              <Text style={{color: "#4F4F4F", fontSize: 18, fontFamily: "SfProDisplayRegular"}}></Text>
            </View>

            <Text style={{color: "#4F4F4F", marginLeft: 18, marginTop: 8, fontSize: 17, fontFamily: "SfProDisplayRegular"}}>misol uchun: ISUZU</Text>
          </View>

          <View style={{paddingHorizontal: 38, marginTop: 28, width: "100%"}}>
            <View style={{width: "100%", borderColor: focusedInput == "DetailInput" || detailInputValue != "" ? "#000000" : "#ADADAD", borderRadius: 10, paddingHorizontal: 18, borderWidth: focusedInput == "DetailInput" || detailInputValue != "" ? 1.5 : 1, height: 104, position: "relative", 
              justifyContent: "flex-start",   
            }}>
              {
                focusedInput == "DetailInput" || detailInputValue != "" ? (
                  <View style={{position: "absolute", top: "-10%", backgroundColor: "#FFF", paddingHorizontal: 7, left: 18}}>
                    <Text style={{color: "#000000"}}>Tavsif</Text>
                  </View>
                ) : (<></>)
              }

              <Text style={focusedInput != "DetailInput" && detailInputValue == "" ? {position: "absolute", top: "20%", color: "#4F4F4F", left: 18, height: "100%", fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular"} : {display: "none"}}>Tavsif</Text>
              <TextInput 
                onPress={() => {
                  scrollToEnd();
                }}
                multiline
                style={{width: "100%", marginTop: 10, fontSize: 18, fontWeight: 400, fontFamily: "SfProDisplayRegular", }} 
                onChange={(e) => setDetailInputValue(e.nativeEvent.text)} 
                onFocus={() => setFocusedInput("DetailInput")} 
                cursorColor={"#000000"}
                onBlur={() => setFocusedInput("")} />
            </View>

            <Text style={{color: "#4F4F4F", marginLeft: 18, marginTop: 8, fontSize: 17, fontFamily: "SfProDisplayRegular"}}>misol uchun: 4 tonna sement</Text>
          </View>

          <View style={{paddingHorizontal: 38, marginTop: 28, width: "100%"}}>
            <View style={{width: "100%", borderColor: "#ADADAD", backgroundColor: "#D9D9D9", borderRadius: 10, paddingHorizontal: 18, borderWidth: 1, height: 55, position: "relative", alignItems: "center", justifyContent: "center"}}>
              <Text style={{color: "#4F4F4F", fontSize: 18, fontFamily: "SfProDisplayRegular", position: "absolute", left: 18}}>+998 91 797 23 85</Text>
            </View>
          </View>

          <View style={{paddingHorizontal: 38, marginTop: 40}}>
            <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
              <Pressable onPress={() => {}} style={{width: "100%", height: 65, backgroundColor: "#000000", borderRadius: 12, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#FFF", fontSize: 18, fontWeight: 700, fontFamily: "SfProDisplayBold"}}>TAYYOR</Text>
              </Pressable>
            </View>
          </View>
          
        </View>
      </ScrollView>
    </View>
  );
}
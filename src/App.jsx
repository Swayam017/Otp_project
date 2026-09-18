import { useEffect, useRef, useState } from "react";
import { Button, Input, message } from "antd";

function App() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // Generate a 6 digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP
  const handleSendOtp = () => {
    if (phone.length !== 10) {
      message.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const newOtp = generateOtp();

    setGeneratedOtp(newOtp);
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setStep("otp");

    // Demo only
    message.success(`OTP sent! Demo OTP: ${newOtp}`);
  };

  // Countdown timer
  useEffect(() => {
    if (step !== "otp" || timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    // Allow only numbers
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      message.error("Please enter the complete OTP");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (enteredOtp === generatedOtp) {
        message.success("OTP verified successfully!");
        setStep("success");
      } else {
        message.error("Invalid OTP. Please try again.");
      }

      setLoading(false);
    }, 500);
  };

  // Resend OTP
  const handleResendOtp = () => {
    const newOtp = generateOtp();

    setGeneratedOtp(newOtp);
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);

    message.success(`New OTP sent! Demo OTP: ${newOtp}`);

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  // Change phone number
  const handleChangeNumber = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">
              🔐
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              OTP Verification
            </h1>

            <p className="text-gray-500 mt-2">
              Secure your account with OTP
            </p>
          </div>

          {/* PHONE STEP */}
          {step === "phone" && (
            <div>

              <label className="block text-gray-700 font-medium mb-2">
                Mobile Number
              </label>

              <Input
                size="large"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(event) => {
                  const value = event.target.value;

                  if (/^\d*$/.test(value)) {
                    setPhone(value);
                  }
                }}
                prefix="+91"
              />

              <Button
                type="primary"
                size="large"
                block
                className="mt-5"
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>

            </div>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <div>

              <div className="text-center mb-6">

                <p className="text-gray-600">
                  We sent a 6-digit OTP to
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  +91 {phone}
                </p>

              </div>

              {/* OTP INPUTS */}
              <div className="flex justify-center gap-2 mb-6">

                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    value={digit}
                    maxLength={1}
                    onChange={(event) =>
                      handleOtpChange(event.target.value, index)
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(event, index)
                    }
                    className="!w-12 !h-12 !text-center !text-xl !font-bold"
                  />
                ))}

              </div>

              {/* Timer */}
              <div className="text-center mb-5">

                {timer > 0 ? (
                  <p className="text-gray-500">
                    Resend OTP in{" "}
                    <span className="font-semibold text-orange-500">
                      {timer}s
                    </span>
                  </p>
                ) : (
                  <Button
                    type="link"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </Button>
                )}

              </div>

              {/* Verify */}
              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                disabled={otp.join("").length !== 6}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </Button>

              {/* Change Number */}
              <Button
                type="link"
                block
                onClick={handleChangeNumber}
                className="mt-2"
              >
                Change Mobile Number
              </Button>

              {/* Demo OTP */}
              <div className="mt-5 p-3 bg-orange-50 rounded-lg text-center">

                <p className="text-xs text-gray-500">
                  Demo OTP
                </p>

                <p className="font-bold text-orange-500 tracking-widest">
                  {generatedOtp}
                </p>

              </div>

            </div>
          )}

          {/* SUCCESS STEP */}
          {step === "success" && (
            <div className="text-center">

              <div className="text-6xl mb-4">
                ✅
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                Verification Successful!
              </h2>

              <p className="text-gray-500 mt-2">
                Your mobile number has been verified successfully.
              </p>

              <Button
                type="primary"
                size="large"
                className="mt-6"
                onClick={handleChangeNumber}
              >
                Verify Another Number
              </Button>

            </div>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-5">
          🔒 Your verification is secure
        </p>

      </div>

    </div>
  );
}

export default App;
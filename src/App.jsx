import { useRef, useState } from "react";
import { Input, Button ,message} from "antd";

function App() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  // Handle typing
  const handleChange = (value, index) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    // Move forward
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard
  const handleKeyDown = (event, index) => {
    // Move left
    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Move right
    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Backspace
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (event, index) => {
    event.preventDefault();

    const pastedText = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedText) {
      return;
    }

    const newOtp = [...otp];

    pastedText.split("").forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit;
      }
    });

    setOtp(newOtp);

    // Focus last filled box
    const nextIndex = Math.min(index + pastedText.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = () => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length === 6) {
    message.success("OTP entered successfully!");
  } else {
    message.error("Please enter all 6 digits");
  }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Enter OTP
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter the 6-digit verification code
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-3 justify-center">

          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              value={digit}
              maxLength={1}
              inputMode="numeric"
              className="!w-12 !h-12 !text-center !text-xl !font-bold"
              onChange={(event) =>
                handleChange(event.target.value, index)
              }
              onKeyDown={(event) =>
                handleKeyDown(event, index)
              }
              onPaste={(event) =>
                handlePaste(event, index)
              }
            />
          ))}

        </div>

        <Button
          type="primary"
          block
          size="large"
          className="mt-6"
          disabled={otp.join("").length !== 6}
          onClick={handleSubmit}
        >
          Verify
        </Button>

      </div>

    </div>
  );
}

export default App;  
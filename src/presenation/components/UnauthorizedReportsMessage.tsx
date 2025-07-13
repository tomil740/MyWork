import "../style/UnauthorizedReportsMessage.css";



const UnauthorizedReportsMessage: React.FC = () => {
  return (
    <div className="unauthorized-reports-message grid place-items-center p-4">
      <div className="text-center">
        <p className="text-lg text-gray-600">אין לך הרשאה לצפות בדיווחים.</p>
        <small className="text-sm text-gray-500">
          אנא התחבר דרך סרגל העליון כדי להמשיך.
        </small>
      </div>
    </div>
  );
};

export default UnauthorizedReportsMessage;

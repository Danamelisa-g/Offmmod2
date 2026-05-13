import { Calendar } from 'lucide-react';
import MoodCalendar from '../../components/moods/MoodCalendar';
import './EmotionHistoryPage.css';
import { useAppContext } from '../../store/AppContext';

const EmotionHistoryPage = () => {

    const { state } = useAppContext();

    return (
        <section className="emotion-history-page">

            <header className="emotion-history-header">

                <div className="emotion-history-texts">

                    <div className="emotion-history-main-title">

                        <Calendar size={24} />

                        <h1>
                            Hello {state.profile.name}
                        </h1>

                    </div>

                    <h3>
                        Here's your emotion history
                    </h3>

                    <p>
                        Track your emotional journey over time
                    </p>

                </div>

            </header>
            <MoodCalendar />

        </section>
    );
};

export default EmotionHistoryPage;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";
import { useNavigation } from "@react-navigation/native";
import { loadToken } from "../store/securetoken"; 
import { Toast, NiveauToast } from "../components/Toast"; 

interface Creneau {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description?: string | null;
  capacite: number;
}

interface Participation {
  id?: string;
  utilisateurId: string;
  creneauId: string;
  dateCreation?: string;
}

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
}

const COLORS = {
  texte: "#2C2C2C",
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || ""; 

function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erreur lors du décodage du JWT :", error);
    return null;
  }
}

export function Participations() {
  const navigation = useNavigation<any>();
  const [token, setToken] = useState<string | null>(null);
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCreneauIds, setSelectedCreneauIds] = useState<string[]>([]);
  const [expandedRecapIds, setExpandedRecapIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastConfig, setToastConfig] = useState<{ message: string; niveau: NiveauToast } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const t = await loadToken();
      setToken(t);
      if (t) {
        const decoded = decodeJwt(t);
        if (decoded) {
          const userId = decoded.id || decoded.sub || decoded.userId;
          setCurrentUserId(userId || null);
        }

        await Promise.all([
          fetchCreneaux(t),
          fetchParticipations(t),
          fetchUtilisateurs(t)
        ]);
      }
      setLoading(false);
    }
    init();
  }, []);

  const fetchCreneaux = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/creneau`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      const liste = Array.isArray(data) ? data : (data.data || []);
      setCreneaux(liste);
    } catch (error) {
      console.error("Erreur récupération créneaux:", error);
    }
  };

  const fetchParticipations = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participation`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      const liste = Array.isArray(data) ? data : (data.data || []);
      setParticipations(liste);
    } catch (error) {
      console.error("Erreur récupération participations:", error);
    }
  };

  const fetchUtilisateurs = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/utilisateur`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      const liste = Array.isArray(data) ? data : (data.data || []);
      setUtilisateurs(liste);
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
    }
  };

  const getParticipantsForCreneau = (creneauId: string): string[] => {
    return participations
      .filter((p) => p.creneauId === creneauId)
      .map((p) => {
        const u = utilisateurs.find((user) => user.id === p.utilisateurId);
        return u ? `${u.prenom} ${u.nom}` : "Utilisateur Inconnu";
      });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
    setSelectedCreneauIds([]); 
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
    setSelectedCreneauIds([]); 
  };

  const formatTexteDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options).replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  const formatDateNumerique = (dateStr: string): string => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatHeureMinute = (dateStr: string | Date): string => {
    const d = new Date(dateStr);
    const heures = d.getHours();
    const minutes = d.getMinutes();
    return minutes > 0 ? `${heures}h${String(minutes).padStart(2, '0')}` : `${heures}h`;
  };

  const handleToggleCreneau = (creneauId: string) => {
    setSelectedCreneauIds((prev) => {
      const updated = prev.includes(creneauId)
        ? prev.filter((id) => id !== creneauId)
        : [...prev, creneauId];
      setExpandedRecapIds(updated);
      return updated;
    });
  };

  const toggleExpandRecap = (id: string) => {
    setExpandedRecapIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleValiderReservations = async () => {
    if (!token || !currentUserId) {
      setToastConfig({
        message: "Session utilisateur introuvable. Veuillez vous reconnecter.",
        niveau: "alerte"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const promises = selectedCreneauIds.map((id) =>
        fetch(`${API_BASE_URL}/participation`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            utilisateurId: currentUserId, 
            creneauId: id 
          }),
        }).then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Erreur lors de l'enregistrement de la participation.");
          }
          return res.json();
        })
      );

      await Promise.all(promises);
      
      setSelectedCreneauIds([]);
      setIsModalVisible(false);
      
      setToastConfig({
        message: "Votre participation a bien été enregistrée !",
        niveau: "ok"
      });

      await fetchParticipations(token); 
    } catch (error: any) {
      console.error("Erreur lors de la réservation :", error);
      setToastConfig({
        message: error.message || "Une erreur est survenue lors de la validation.",
        niveau: "alerte"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToProfilParticipations = () => {
    navigation.navigate("profil", { openSection: "Mes participations" });
  };

  const renderCreneauxDuJour = () => {
    if (!creneaux || !Array.isArray(creneaux)) return null;

    const creneauxDuJour = creneaux.filter((c) => {
      if (!c || !c.dateDebut) return false;
      const dateDebut = new Date(c.dateDebut);
      return (
        dateDebut.getDate() === currentDate.getDate() &&
        dateDebut.getMonth() === currentDate.getMonth() &&
        dateDebut.getFullYear() === currentDate.getFullYear()
      );
    });

    if (creneauxDuJour.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun créneau disponible pour ce jour</Text>
        </View>
      );
    }

    creneauxDuJour.sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());

    const maintenant = new Date();

    return creneauxDuJour.map((creneau) => {
      const isSelected = selectedCreneauIds.includes(creneau.id);
      const dateDeb = new Date(creneau.dateDebut);
      const dateFin = new Date(creneau.dateFin);

      // 1. Vérification si le créneau est déjà passé
      const isPast = dateDeb < maintenant;

      // 2. Vérification si l'utilisateur connecté est déjà inscrit à ce créneau
      const isAlreadyRegistered = participations.some(
        (p) => p.creneauId === creneau.id && p.utilisateurId === currentUserId
      );

      // Un créneau ne peut pas être cliqué s'il est passé OU si on y est déjà inscrit
      const isDisabled = isPast || isAlreadyRegistered;

      return (
        <TouchableOpacity
          key={creneau.id}
          onPress={() => handleToggleCreneau(creneau.id)}
          disabled={isDisabled}
          style={[
            styles.slotRow,
            styles.slotActive,
            isSelected && styles.slotSelected,
            isAlreadyRegistered && styles.slotAlreadyRegistered, // Style si déjà inscrit
            isPast && styles.slotPast, // Style si dépassé (grisé)
          ]}
        >
          <Text style={[styles.hourText, isDisabled && styles.disabledText]}>
            {formatHeureMinute(dateDeb)}
          </Text>
          
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[
              styles.activityText, 
              isSelected && styles.selectedText,
              isDisabled && styles.disabledText
            ]}>
              {creneau.nom}
            </Text>
            {isAlreadyRegistered && (
              <MaterialIcons name="check-circle" size={16} color="#3E5C45" style={{ marginLeft: 6 }} />
            )}
          </View>

          <Text style={[styles.hourText, isDisabled && styles.disabledText]}>
            {formatHeureMinute(dateFin)}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#D4833B" />
      </View>
    );
  }

  const swipeConfig = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 150,
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.titlePage}>Participations</Text>
        <Text style={styles.subtitlePage}>
          Vous avez <Text style={{ fontWeight: "bold" }}>Xh</Text> à réaliser ce mois-ci.
        </Text>
        <TouchableOpacity onPress={handleGoToProfilParticipations}>
          <Text style={styles.linkText}>Voir mes participations</Text>
        </TouchableOpacity>
      </View>

      {/* --- DATE SELECTOR --- */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatTexteDate(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* --- ZONE SWIPABLE --- */}
      <GestureRecognizer
        onSwipeLeft={handleNextDay}
        onSwipeRight={handlePreviousDay}
        config={swipeConfig}
        style={styles.swipeZone}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderCreneauxDuJour()}
        </ScrollView>
      </GestureRecognizer>

      {/* --- BOUTON FLOTTANT --- */}
      {selectedCreneauIds.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>Réservez le créneau</Text>
        </TouchableOpacity>
      )}

      {/* --- MODAL --- */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Récapitulatif</Text>
            <Text style={styles.modalSubtitle}>Vous avez choisi le(s) créneau(x) suivants :</Text>

            <ScrollView style={{ maxHeight: 280, width: "100%", marginBottom: 20 }}>
              {selectedCreneauIds.map((id) => {
                if (!creneaux || !Array.isArray(creneaux)) return null;

                const c = creneaux.find((item) => item.id === id);
                if (!c) return null;
                
                const isExpanded = expandedRecapIds.includes(id);
                const listeParticipants = getParticipantsForCreneau(c.id);

                return (
                  <View key={`recap-${id}`} style={styles.recapCardContainer}>
                    <TouchableOpacity 
                      style={styles.recapHeaderRow} 
                      onPress={() => toggleExpandRecap(id)}
                    >
                      <MaterialIcons
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={18}
                        color={COLORS.texte}
                        style={styles.arrowIcon}
                      />
                      <Text style={styles.recapCardTitle}>
                        {c.nom} de {formatHeureMinute(c.dateDebut)} à {formatHeureMinute(c.dateFin)} le {formatDateNumerique(c.dateDebut)}
                      </Text>
                    </TouchableOpacity>
                    
                    {isExpanded && (
                      <View style={styles.recapCardDetails}>
                        <Text style={styles.recapCardLabel}>Participants inscrits :</Text>
                        {listeParticipants.length > 0 ? (
                          listeParticipants.map((nomParticipant, index) => (
                            <Text key={`part-${id}-${index}`} style={styles.recapCardUser}>
                              • {nomParticipant}
                            </Text>
                          ))
                        ) : (
                          <Text style={[styles.recapCardUser, { fontStyle: "italic", color: "#666" }]}>
                            Personne pour le moment
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnAnnuler]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.btnTextWhite}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.btnValider]}
                onPress={handleValiderReservations}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnTextWhite}>Valider</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- RENDER TOAST GLOBAL --- */}
      {toastConfig && (
        <Toast 
          message={toastConfig.message}
          niveau={toastConfig.niveau}
          onHide={() => setToastConfig(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBF7", paddingTop: 50 },
  center: { justifyContent: "center", alignItems: "center" },
  headerContainer: { alignItems: "center", marginBottom: 15 },
  titlePage: { fontFamily: "Outfit_700Bold", fontSize: 26, color: "#D4833B", marginBottom: 10 },
  subtitlePage: { fontFamily: "Outfit_400Regular", fontSize: 15, color: "#333" },
  linkText: { fontFamily: "Outfit_600SemiBold", color: "#3E5C45", textDecorationLine: "underline", marginTop: 5 },
  dateSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, marginBottom: 15 },
  dateText: { fontFamily: "Outfit_700Bold", fontSize: 18, color: "#2C2C2C" },
  arrow: { fontSize: 22, fontWeight: "bold", color: "#2C2C2C", paddingHorizontal: 10 },
  swipeZone: { flex: 1, width: "100%" },
  scrollContainer: { paddingHorizontal: 15, paddingBottom: 100 },
  slotRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 15, borderRadius: 4, marginBottom: 8 },
  slotActive: { backgroundColor: "#D6EBD3" },
  slotSelected: { backgroundColor: "#A8D4A3" },
  slotAlreadyRegistered: { backgroundColor: "#EAF6E9", borderColor: "#A8D4A3", borderWidth: 1 },
  slotPast: { backgroundColor: "#EAEAEA", opacity: 0.5 },
  disabledText: { color: "#888", fontStyle: "italic" },
  hourText: { fontFamily: "Outfit_600SemiBold", fontSize: 14, color: "#000", width: 48 },
  activityText: { fontFamily: "Outfit_400Regular", fontSize: 15, color: "#333", textAlign: "center" },
  selectedText: { fontFamily: "Outfit_600SemiBold" },
  emptyContainer: { flex: 1, minHeight: 400, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  emptyText: { fontFamily: "Outfit_400Regular", fontSize: 16, color: "#888", textAlign: "center", fontStyle: "italic" },
  floatingButton: { position: "absolute", bottom: 30, left: "15%", right: "15%", backgroundColor: "#D4833B", paddingVertical: 15, borderRadius: 8, alignItems: "center", elevation: 4 },
  floatingButtonText: { fontFamily: "Outfit_700Bold", color: "#FFF", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "88%", backgroundColor: "#FFF", borderRadius: 20, padding: 20, alignItems: "center" },
  modalTitle: { fontFamily: "Outfit_700Bold", fontSize: 22, color: "#2C2C2C", marginBottom: 15 },
  modalSubtitle: { fontFamily: "Outfit_400Regular", fontSize: 14, color: "#4A4A4A", textAlign: "center", marginBottom: 20 },
  recapCardContainer: { backgroundColor: "#D6EBD3", borderRadius: 8, marginBottom: 10, width: "100%", overflow: "hidden" },
  recapHeaderRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  arrowIcon: { marginRight: 8 },
  recapCardTitle: { fontFamily: "Outfit_400Regular", fontSize: 14, color: "#2C2C2C", flex: 1 },
  // La correction est ici (guillemet corrigé sur le backgroundColor) :
  recapCardDetails: { backgroundColor: "rgba(255, 255, 255, 0.4)", paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: "#B5D6B1" },
  recapCardLabel: { fontFamily: "Outfit_400Regular", fontSize: 12, color: "#555", marginBottom: 4 },
  recapCardUser: { fontFamily: "Outfit_600SemiBold", fontSize: 13, color: "#2C2C2C", paddingLeft: 4, marginVertical: 1 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  modalButton: { flex: 0.47, paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  btnAnnuler: { backgroundColor: "#3E5243" },
  btnValider: { backgroundColor: "#D4833B" },
  btnTextWhite: { fontFamily: "Outfit_700Bold", color: "#FFF", fontSize: 16 }
});